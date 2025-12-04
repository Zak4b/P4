import dotenv from "dotenv";
dotenv.config();

// Charger la configuration de l'environnement en premier
import { env } from "./config/env.js";

import Fastify from "fastify";
import { Server } from "socket.io";
import { websocketConnection } from "./websocket.js";
import { registerRoutes } from "./routes/routes.js";

const fastify = Fastify({
	logger: {
		level: process.env.NODE_ENV === "production" ? "info" : "debug",
	},
});

// CORS configuration for frontend
// Support multiple origins for development (Vite on 5173 and Next.js on 3001)
const allowedOrigins = process.env.FRONTEND_URL 
	? process.env.FRONTEND_URL.split(',').map(url => url.trim())
	: ["http://localhost:3001", "http://localhost:5173"];

const corsOptions = {
	origin: allowedOrigins,
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
	exposedHeaders: ["Set-Cookie"],
};

// Enregistrer les plugins Fastify
await fastify.register(import("@fastify/cors"), corsOptions);
await fastify.register(import("@fastify/cookie"), {
	secret: env.jwt.secret, // Utiliser le secret JWT depuis la configuration
	parseOptions: {},
});

// Socket.IO setup - utiliser le serveur HTTP de Fastify
const httpServer = fastify.server;
const io = new Server(httpServer, {
	cors: {
		origin: allowedOrigins,
		credentials: true,
	},
	path: "/socket.io",
});

// Socket.IO connection handler
io.on("connection", async (socket) => {
	fastify.log.info({ address: socket.handshake.address }, "Socket.IO connection attempt");
	
	// Parser les cookies depuis le header Cookie
	const cookieHeader = socket.handshake.headers.cookie || "";
	const signedCookies: { [key: string]: any } = {};
	
	if (cookieHeader) {
		// Parser les cookies
		const cookies = cookieHeader.split(";").reduce((acc: { [key: string]: string }, cookie) => {
			const [key, value] = cookie.trim().split("=");
			if (key && value) {
				acc[key] = decodeURIComponent(value);
			}
			return acc;
		}, {});
		
		// Extraire le token JWT directement (non signé par Fastify)
		if (cookies.token) {
			signedCookies.token = cookies.token.trim().replace(/\s+/g, '');
		}
	}
	
	// Créer un objet req-like à partir du handshake Socket.IO pour la compatibilité
	const req = {
		signedCookies,
		headers: socket.handshake.headers,
		cookies: {},
	} as any;
	websocketConnection(socket, req);
});

// Gérer les erreurs de connexion Socket.IO
io.engine.on("connection_error", (err) => {
	fastify.log.error("Socket.IO connection error:", err);
});

// Enregistrer les routes
await registerRoutes(fastify);

// Error Handling
fastify.setNotFoundHandler(async (request, reply) => {
	fastify.log.error({ url: request.url }, "API endpoint not found");
	reply.status(404).send({ error: "API endpoint not found" });
});

fastify.setErrorHandler(async (error: Error & { statusCode?: number }, request, reply) => {
	fastify.log.error(error);
	reply.status(error.statusCode || 500).send({
		error: error.message || "Internal server error",
	});
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const IP = process.env.IP || "localhost";

try {
	await fastify.listen({ port: PORT, host: IP });
	fastify.log.info(`Backend API server running on ${IP}:${PORT}`);
} catch (err) {
	fastify.log.error(err);
	process.exit(1);
}
