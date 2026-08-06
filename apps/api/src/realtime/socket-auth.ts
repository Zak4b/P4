import type { DefaultEventsMap, Socket } from "socket.io";
import { parse as parseCookie } from "cookie";
import { cookieName } from "../modules/auth/request-auth.js";
import { verifyToken, type JWTPayload } from "../modules/auth/jwt.js";

export interface SocketData {
	user: JWTPayload;
}

/** Socket typé après authentification : `socket.data.user` est garanti par le compilateur, plus de cast */
export type AuthenticatedSocket = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>;

/** Utilisateur authentifié depuis le cookie de session d'un handshake Socket.IO */
export const getUserFromSocket = (socket: Socket): JWTPayload | null => {
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
