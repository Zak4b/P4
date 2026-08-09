import type { DefaultEventsMap, Socket } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents } from "@p4/schemas/realtime";
import { parse as parseCookie } from "cookie";
import { cookieName } from "../modules/auth/request-auth.js";
import { verifyToken, type JWTPayload } from "../modules/auth/jwt.js";

export interface SocketData {
	user: JWTPayload;
}

/**
 * Socket typé après authentification : `socket.data.user` est garanti par le compilateur.
 * Les événements entrants (`ClientToServerEvents`) restent des données non fiables :
 * tout payload doit passer par `onValidated` (validation zod) avant usage.
 */
export type AuthenticatedSocket = Socket<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketData>;

/** Utilisateur authentifié depuis le cookie de session d'un handshake Socket.IO */
export const getUserFromSocket = (socket: AuthenticatedSocket): JWTPayload | null => {
	const cookieHeader = socket.handshake.headers.cookie;
	if (!cookieHeader) {
		return null;
	}
	const token = parseCookie(cookieHeader)[cookieName];
	if (!token) {
		return null;
	}
	try {
		return verifyToken(token);
	} catch {
		return null;
	}
};
