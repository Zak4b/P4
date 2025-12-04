import { Request } from "express";
import auth from "../actions/auth.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Obtenir un identifiant unique pour un utilisateur depuis JWT ou les cookies
 * Pour JWT: utilise l'email comme identifiant unique
 * Pour les anciens cookies: utilise l'UUID
 * Sinon: génère un nouveau UUID (utilisateur anonyme)
 */
export const getUserIdentifier = (req: Request): string => {
	// Essayer d'abord JWT
	const userPayload = auth.getUserFromRequest(req);
	if (userPayload) {
		// Utiliser l'email comme identifiant unique pour JWT
		return userPayload.email;
	}
	
	// Sinon, essayer les cookies (rétrocompatibilité)
	const cookieToken = req.signedCookies.token;
	if (cookieToken && typeof cookieToken === "object" && cookieToken.uuid) {
		return cookieToken.uuid;
	}
	
	// Sinon, générer un nouveau UUID (utilisateur anonyme)
	return uuidv4();
};

/**
 * Obtenir l'ID utilisateur depuis JWT
 */
export const getUserId = (req: Request): number | null => {
	const userPayload = auth.getUserFromRequest(req);
	return userPayload?.userId || null;
};

