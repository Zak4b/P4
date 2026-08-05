import type { FastifyInstance } from "fastify";
import { Server, type DefaultEventsMap } from "socket.io";
import { websocketConnection } from "../../realtime/gateway.js";
import { getUserFromSocket } from "../../realtime/socket-auth.js";
import type { SocketData } from "../../realtime/socket-auth.js";
import { getSocketIOCorsOptions } from "../../config/cors.js";

type GameServer = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>;

declare module "fastify" {
	interface FastifyInstance {
		/** Instance Socket.IO partagée, accessible depuis les routes/plugins via `fastify.io`. */
		io: GameServer;
	}
}

class SocketServer {
	private static _instance: SocketServer | null = null;
	readonly io: GameServer;

	private constructor(fastify: FastifyInstance) {
		this.io = new Server(fastify.server, {
			cors: getSocketIOCorsOptions(),
			path: "/api/socket.io",
		});

		// Authentifie la connexion avant l'évènement "connection" : rejette proprement
		// (le client reçoit "connect_error") si le cookie de session est absent/invalide.
		this.io.use((socket, next) => {
			const user = getUserFromSocket(socket);
			if (!user) {
				next(new Error("Authentication required"));
				return;
			}
			socket.data.user = user;
			next();
		});

		this.io.on("connection", (socket) => {
			fastify.log.info({ address: socket.handshake.address }, "Socket.IO connection");
			websocketConnection(socket);
		});

		this.io.engine.on("connection_error", (err) => {
			fastify.log.error("Socket.IO connection error:", err);
		});
	}

	static initialize(fastify: FastifyInstance): GameServer {
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

export function registerSocketIO(fastify: FastifyInstance): GameServer {
	const io = SocketServer.initialize(fastify);
	fastify.decorate("io", io);
	return io;
}

export const getSocketIO = (): GameServer => SocketServer.instance.io;
