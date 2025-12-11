import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

declare global {
	var server: HttpServer;
	var io: SocketIOServer;
}

export {};