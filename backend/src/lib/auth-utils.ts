import { FastifyRequest } from "fastify";
import auth from "../actions/auth.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Obtenir un identifiant unique pour un utilisateur depuis JWT ou les cookies
 * Pour JWT: utilise l'email comme identifiant unique
 * Pour les anciens cookies: utilise l'UUID
 * Sinon: génère un nouveau UUID (utilisateur anonyme)
 */
export const getUserIdentifier = (req: FastifyRequest): string => {
	// Adapter la requête Fastify pour la compatibilité avec auth
	const expressLikeReq = {
		signedCookies: req.cookies,
		cookies: req.cookies,
		headers: req.headers,
	} as any;

	// Essayer d'abord JWT
	const userPayload = auth.getUserFromRequest(expressLikeReq);
	if (userPayload) {
		// Utiliser l'email comme identifiant unique pour JWT
		return userPayload.email;
	}

	// Sinon, essayer les cookies (rétrocompatibilité)
	const cookieToken = req.cookies.token;
	if (cookieToken && typeof cookieToken === "object") {
		const tokenObj = cookieToken as { uuid?: string };
		if (tokenObj.uuid && typeof tokenObj.uuid === "string") {
			return tokenObj.uuid;
		}
	}

	// Sinon, générer un nouveau UUID (utilisateur anonyme)
	return uuidv4();
};

/**
 * Obtenir l'ID utilisateur depuis JWT
 */
export const getUserId = (req: FastifyRequest): number | null => {
	const expressLikeReq = {
		signedCookies: req.cookies,
		cookies: req.cookies,
		headers: req.headers,
	} as any;

	const userPayload = auth.getUserFromRequest(expressLikeReq);
	return userPayload?.userId || null;
};

