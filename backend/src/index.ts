import dotenv from "dotenv";
dotenv.config();

// Charger la configuration de l'environnement en premier
import "./config/env.js";

import express from "express";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { unsign } from "cookie-signature";
import { websocketConnection } from "./websocket.js";
import { router } from "./routes/gameP4.js";

const app = express();
const httpServer = createServer(app);

// CORS configuration for frontend
const corsOptions = {
	origin: process.env.FRONTEND_URL || "http://localhost:5173",
	credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser("shhhhh"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.IO setup - utiliser le path par défaut pour éviter les conflits avec les routes Express
const io = new Server(httpServer, {
	cors: corsOptions,
	path: "/socket.io",
});

// Socket.IO connection handler
io.on("connection", async (socket) => {
	console.log("Socket.IO connection attempt from:", socket.handshake.address);
	
	// Parser les cookies depuis le header Cookie
	const cookieHeader = socket.handshake.headers.cookie || "";
	const signedCookies: { [key: string]: any } = {};
	const cookieSecret = "shhhhh"; // Même secret que cookie-parser
	
	// Parser les cookies signés
	if (cookieHeader) {
		const cookies = cookieHeader.split(";").reduce((acc: { [key: string]: string }, cookie) => {
			const [key, value] = cookie.trim().split("=");
			if (key && value) {
				acc[key] = decodeURIComponent(value);
			}
			return acc;
		}, {});
		
		// Vérifier et parser les cookies signés
		// Les cookies signés par cookie-parser ont le format "s:value.signature"
		if (cookies.token) {
			if (cookies.token.startsWith("s:")) {
				// Cookie signé - extraire la valeur
				const unsigned = unsign(cookies.token.slice(2), cookieSecret);
				if (unsigned !== false) {
					signedCookies.token = unsigned;
				}
			} else {
				// Cookie non signé ou JWT direct
				signedCookies.token = cookies.token;
			}
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
	console.error("Socket.IO connection error:", err);
});

// API routes
app.use("/P4", router);

//Error Handling
app.use(async (req, res, next) => {
	const err = new Error("Not Found") as Error & { status?: number };
	err.status = 404;
	next(err);
});

import { Request, Response, NextFunction } from "express";

app.use(async (err: Error & { status?: number }, req: Request, res: Response, next: NextFunction) => {
	if (err.status === 404) {
		console.error("API endpoint not found", req.url);
		res.status(404).json({ error: "API endpoint not found" });
	} else {
		console.error(err.stack);
		res.status(500).json({ error: "Internal server error" });
	}
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const IP = process.env.IP || "localhost";

httpServer.listen(PORT, IP, () => {
	console.info(`Backend API server running on ${IP}:${PORT}`);
});
