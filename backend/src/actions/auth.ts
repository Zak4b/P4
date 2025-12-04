import user from "./user.js";
import { generateToken, verifyToken, JWTPayload } from "../lib/jwt.js";
import { v4 as uuidv4 } from "uuid";

// Type pour les requêtes Fastify
type RequestLike = {
	signedCookies: { [key: string]: any };
	cookies: { [key: string]: any };
	headers: { [key: string]: string | undefined; authorization?: string };
};

type ResponseLike = {
	status: (code: number) => { json: (data: any) => any };
};

const cookieName: string = "token";

// Obtenir le token depuis les cookies ou le header Authorization
const getToken = (req: RequestLike): string | null => {
	// Essayer d'abord depuis les cookies signés (Fastify les met dans cookies après désignature)
	const cookieToken = req.signedCookies[cookieName] || req.cookies[cookieName];
	if (cookieToken) {
		const token = typeof cookieToken === "string" ? cookieToken : cookieToken.token || null;
		console.debug("[auth.getToken] Found token in cookies", { hasToken: !!token, cookieName });
		return token;
	}

	// Sinon, essayer depuis le header Authorization
	const authHeader = req.headers.authorization;
	if (authHeader && authHeader.startsWith("Bearer ")) {
		const token = authHeader.substring(7);
		console.debug("[auth.getToken] Found token in Authorization header");
		return token;
	}

	console.debug("[auth.getToken] No token found", { signedCookiesKeys: Object.keys(req.signedCookies || {}), cookiesKeys: Object.keys(req.cookies || {}) });
	return null;
};

// Obtenir les données du cookie (pour rétrocompatibilité)
const cookie = (req: RequestLike): { userId?: number; username?: string; uuid?: string } | null => {
	return req.signedCookies[cookieName] || null;
};

// Vérifier si l'utilisateur est authentifié
const isLogged = (req: RequestLike, res: ResponseLike): boolean => {
	try {
		const token = getToken(req);
		if (!token) {
			console.debug("[auth.isLogged] No token found", { signedCookies: req.signedCookies, cookies: req.cookies });
			return false;
		}

		const payload = verifyToken(token);
		if (!payload || !payload.userId) {
			console.debug("[auth.isLogged] Invalid token or no userId", { payload });
			return false;
		}

		// Attacher les infos utilisateur à la requête
		(req as any).user = payload;
		return true;
	} catch (error) {
		console.debug("[auth.isLogged] Error verifying token:", error);
		return false;
	}
};

// Obtenir l'utilisateur depuis le token
const getUserFromRequest = (req: RequestLike): JWTPayload | null => {
	try {
		const token = getToken(req);
		if (!token) {
			return null;
		}

		return verifyToken(token);
	} catch (error) {
		return null;
	}
};

// S'inscrire
const register = async (name: string, email: string, password: string): Promise<{ token: string; user: { id: number; name: string; email: string } }> => {
	// Vérifier si l'email existe déjà
	const existingUser = await user.findByEmail(email);
	if (existingUser) {
		throw new Error("Email already exists");
	}

	// Créer l'utilisateur
	const userId = await user.create(name, email, password);
	const userData = await user.getById(userId);

	if (!userData) {
		throw new Error("Failed to create user");
	}

	// Générer le token JWT
	const token = generateToken({
		userId: userData.id,
		email: userData.email,
		name: userData.name,
	});

	return {
		token,
		user: {
			id: userData.id,
			name: userData.name,
			email: userData.email,
		},
	};
};

// Se connecter
const login = async (email: string, password: string): Promise<{ token: string; user: { id: number; name: string; email: string } }> => {
	// Vérifier les identifiants
	const userData = await user.verifyCredentials(email, password);
	if (!userData) {
		throw new Error("Invalid email or password");
	}

	// Générer le token JWT
	const token = generateToken({
		userId: userData.id,
		email: userData.email,
		name: userData.name,
	});

	return {
		token,
		user: {
			id: userData.id,
			name: userData.name,
			email: userData.email,
		},
	};
};

// Connexion simple (pour rétrocompatibilité)
const loggin = async (username: string): Promise<{ cookieContent: { userId: number; username: string; uuid: string } }> => {
	return new Promise(async (resolve, reject) => {
		try {
			const uuid = uuidv4();
			const userId = await user.createSimple(username, uuid);
			const userData = await user.getById(userId);

			if (!userData) {
				throw new Error("Failed to create user");
			}

			resolve({ cookieContent: { userId, username: userData.name, uuid } });
		} catch (error) {
			console.error(error);
			reject(error);
		}
	});
};

export default {
	login,
	register,
	loggin,
	isLogged,
	getUserFromRequest,
	cookie,
	cookieName,
	getToken,
};
