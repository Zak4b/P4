import { FastifyRequest } from "fastify";
import { verifyToken, JWTPayload } from "./jwt.js";

export const cookieName = "token";

/** Utilisateur authentifié depuis le cookie de session d'une requête HTTP (Fastify) */
export const getUserFromRequest = (request: FastifyRequest): JWTPayload | null => {
	const token = request.cookies[cookieName];
	if (!token) {
		return null;
	}
	try {
		return verifyToken(token);
	} catch {
		return null;
	}
};
