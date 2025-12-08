import { FastifyRequest } from "fastify";
import auth from "../services/auth.js";

// Construit un objet minimal compatible avec auth.* à partir d'une requête Fastify
export const toAuthRequest = (req: FastifyRequest | any) => ({
	signedCookies: req.signedCookies || req.cookies || {},
	cookies: req.cookies || {},
	headers: req.headers,
});

/**
 * Obtenir un identifiant unique pour un utilisateur depuis JWT ou les cookies
 * Pour JWT: utilise l'email comme identifiant unique
 * Pour les anciens cookies: utilise l'UUID
 * Sinon: génère un nouveau UUID (utilisateur anonyme)
 */
export const getUserIdentifier = (req: FastifyRequest | any): string => {
	const request = toAuthRequest(req);

	// Essayer d'abord JWT
	const userPayload = auth.getUserFromRequest(request);
	if (userPayload) {
		return userPayload.email;
	}

	throw new Error("Authentication required");
};

/**
 * Obtenir l'ID utilisateur depuis JWT
 */
export const getUserId = (req: FastifyRequest): number | null => {
	const request = toAuthRequest(req);
	const userPayload = auth.getUserFromRequest(request);
	return userPayload?.userId || null;
};

/**
 * Obtenir le payload JWT complet depuis la requête
 */
export const getUserFromRequest = (req: FastifyRequest | any) => {
	const request = toAuthRequest(req);
	return auth.getUserFromRequest(request);
};

/**
 * Vérifier si l'utilisateur est authentifié
 */
export const isLogged = (req: FastifyRequest | any): boolean => {
	const request = toAuthRequest(req);
	return auth.isLogged(request);
};
