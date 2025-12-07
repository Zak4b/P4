import { FastifyRequest } from "fastify";
import auth from "../services/auth.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Normalise une requête Fastify pour l'authentification JWT
 * Crée un objet compatible avec auth.getUserFromRequest()
 * 
 * Dans Fastify avec @fastify/cookie:
 * - Les cookies non signés sont dans request.cookies
 * - Les cookies signés sont aussi dans request.cookies après désignature
 * - On met request.cookies dans signedCookies et cookies pour compatibilité
 */
export const normalizeRequestForAuth = (req: FastifyRequest | any): any => {
	// Adapter la requête Fastify pour la compatibilité avec auth
	// Pour WebSocket, req.signedCookies contient le token désigné
	// Pour les requêtes HTTP Fastify, req.cookies contient les cookies
	const signedCookies = (req as any).signedCookies || req.cookies || {};
	const cookies = req.cookies || {};
	
	return {
		signedCookies,
		cookies,
		headers: req.headers,
	};
};

/**
 * Obtenir un identifiant unique pour un utilisateur depuis JWT ou les cookies
 * Pour JWT: utilise l'email comme identifiant unique
 * Pour les anciens cookies: utilise l'UUID
 * Sinon: génère un nouveau UUID (utilisateur anonyme)
 */
export const getUserIdentifier = (req: FastifyRequest | any): string => {
	const expressLikeReq = normalizeRequestForAuth(req);

	// Essayer d'abord JWT
	const userPayload = auth.getUserFromRequest(expressLikeReq);
	if (userPayload) {
		return userPayload.email;
	}

	// Sinon, essayer les cookies (rétrocompatibilité)
	const cookieToken = expressLikeReq.cookies.token || expressLikeReq.signedCookies.token;
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
	const expressLikeReq = normalizeRequestForAuth(req);
	const userPayload = auth.getUserFromRequest(expressLikeReq);
	return userPayload?.userId || null;
};

/**
 * Obtenir le payload JWT complet depuis la requête
 */
export const getUserFromRequest = (req: FastifyRequest | any) => {
	const expressLikeReq = normalizeRequestForAuth(req);
	return auth.getUserFromRequest(expressLikeReq);
};

/**
 * Vérifier si l'utilisateur est authentifié
 */
export const isLogged = (req: FastifyRequest | any, res?: any): boolean => {
	const expressLikeReq = normalizeRequestForAuth(req);
	const expressLikeRes = res || {
		status: (code: number) => ({
			json: (data: any) => data,
		}),
	};
	return auth.isLogged(expressLikeReq, expressLikeRes);
};

