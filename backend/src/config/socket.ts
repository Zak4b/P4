import { Server } from "socket.io";
import type { FastifyInstance } from "fastify";
import { parse as parseCookie } from "cookie";
import { websocketConnection } from "../websocket.js";
import { toAuthRequest } from "../lib/auth-utils.js";
import { getSocketIOCorsOptions } from "./cors.js";

/**
 * Configure et initialise Socket.IO avec les handlers de connexion
 */
export function setupSocketIO(fastify: FastifyInstance): Server {
	const httpServer = fastify.server;
	const io = new Server(httpServer, {
		cors: getSocketIOCorsOptions(),
		path: "/api/socket.io",
	});

	// Socket.IO connection handler
	io.on("connection", async (socket) => {
		fastify.log.info({ address: socket.handshake.address }, "Socket.IO connection attempt");
		
		const cookieHeader = socket.handshake.headers.cookie || "";
		const cookies = cookieHeader ? parseCookie(cookieHeader) : {};

		const req = toAuthRequest({
			cookies,
			headers: socket.handshake.headers,
		});
		websocketConnection(socket, req);
	});

	// Gérer les erreurs de connexion Socket.IO
	io.engine.on("connection_error", (err) => {
		fastify.log.error("Socket.IO connection error:", err);
	});

	return io;
}

