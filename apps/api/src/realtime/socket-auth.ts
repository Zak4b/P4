import type { DefaultEventsMap, Socket } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents } from "@p4/schemas/realtime";
import { parse as parseCookie } from "cookie";
import { cookieName } from "../modules/auth/request-auth.js";
import { verifyToken } from "../modules/auth/jwt.js";
import { UserService } from "../modules/user/user.service.js";

export interface SocketUser {
	id: string;
	username: string;
}

export interface SocketData {
	user: SocketUser;
}

/**
 * Socket typé après authentification : `socket.data.user` est garanti par le compilateur.
 * Les événements entrants (`ClientToServerEvents`) restent des données non fiables :
 * tout payload doit passer par `onValidated` (validation zod) avant usage.
 */
export type AuthenticatedSocket = Socket<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketData>;

/** Utilisateur authentifié depuis le cookie de session d'un handshake Socket.IO */
export const getUserFromSocket = async (socket: AuthenticatedSocket): Promise<SocketUser | null> => {
	const cookieHeader = socket.handshake.headers.cookie;
	if (!cookieHeader) {
		return null;
	}
	const token = parseCookie(cookieHeader)[cookieName];
	if (!token) {
		return null;
	}
	let id: string;
	try {
		({ id } = verifyToken(token));
	} catch {
		return null;
	}
	const user = await UserService.getById(id);
	return user ? { id: user.id, username: user.username } : null;
};
