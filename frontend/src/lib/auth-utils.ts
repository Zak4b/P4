import auth from "../services/auth.service";

// Construit un objet minimal compatible avec auth.* à partir d'une requête Next.js ou Socket.IO
export const toAuthRequest = (req: any) => ({
	cookies: req.cookies || {},
	headers: req.headers || {},
});

/**
 * Obtenir un identifiant unique pour un utilisateur depuis JWT ou les cookies
 * Pour JWT: utilise l'email comme identifiant unique
 * Pour les anciens cookies: utilise l'UUID
 * Sinon: génère un nouveau UUID (utilisateur anonyme)
 */
export const getUserIdentifier = (req: any): string => {
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
export const getUserId = (req: any): string | null => {
	const request = toAuthRequest(req);
	const userPayload = auth.getUserFromRequest(request);
	if (!userPayload) {
		throw new Error("Authentication required");
	}
	return userPayload.id;
};

/**
 * Obtenir le payload JWT complet depuis la requête
 */
export const getUserFromRequest = (req: any) => {
	const request = toAuthRequest(req);
	return auth.getUserFromRequest(request);
};

/**
 * Vérifier si l'utilisateur est authentifié
 */
export const isLogged = (req: any): boolean => {
	const request = toAuthRequest(req);
	return auth.isLogged(request);
};