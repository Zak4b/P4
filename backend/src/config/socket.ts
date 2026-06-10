import { Server } from "socket.io";
import type { FastifyInstance } from "fastify";
import { parse as parseCookie } from "cookie";
import { websocketConnection } from "../websocket.js";
import { toAuthRequest } from "../lib/auth-utils.js";
import { getSocketIOCorsOptions } from "./cors.js";

class SocketServer {
	private static _instance: SocketServer | null = null;
	readonly io: Server;

	private constructor(fastify: FastifyInstance) {
		this.io = new Server(fastify.server, {
			cors: getSocketIOCorsOptions(),
			path: "/api/socket.io",
		});

		this.io.on("connection", async (socket) => {
			fastify.log.info({ address: socket.handshake.address }, "Socket.IO connection attempt");

			const cookieHeader = socket.handshake.headers.cookie || "";
			const cookies = cookieHeader ? parseCookie(cookieHeader) : {};

			const req = toAuthRequest({
				cookies,
				headers: socket.handshake.headers,
			});
			await websocketConnection(socket, req);
		});

		this.io.engine.on("connection_error", (err) => {
			fastify.log.error("Socket.IO connection error:", err);
		});
	}

	static initialize(fastify: FastifyInstance): Server {
		if (!SocketServer._instance) {
			SocketServer._instance = new SocketServer(fastify);
		}
		return SocketServer._instance.io;
	}

	static get instance(): SocketServer {
		if (!SocketServer._instance) {
			throw new Error("Socket.IO server not initialized");
		}
		return SocketServer._instance;
	}
}

export function setupSocketIO(fastify: FastifyInstance): Server {
	return SocketServer.initialize(fastify);
}

export const getSocketIO = (): Server => SocketServer.instance.io;
