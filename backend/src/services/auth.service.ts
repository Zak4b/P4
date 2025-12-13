import {UserService} from "./user.service.js";
import { generateToken, verifyToken, JWTPayload } from "../lib/jwt.js";

// Type pour les requêtes Fastify
type RequestLike = {
	cookies: Record<string, string>;
	headers: { [key: string]: string | undefined; authorization?: string };
};

const cookieName: string = "token";

// Obtenir le token depuis les cookies ou le header Authorization
const getToken = (req: RequestLike): string | null => {
	// Essayer d'abord depuis les cookies
	const token = req.cookies[cookieName];
	if (token) {
			return token;
	}

	// Sinon, essayer depuis le header Authorization
	const authHeader = req.headers.authorization;
	if (authHeader && authHeader.startsWith("Bearer ")) {
		return authHeader.substring(7);
	}
	return null;
};

// Vérifier si l'utilisateur est authentifié
const isLogged = (req: RequestLike): boolean => {
	try {
		const token = getToken(req);
		if (!token) {
			return false;
		}

		const payload = verifyToken(token);
		if (!payload || !payload.id) {
			return false;
		}
		return true;
	} catch {
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
	} catch {
		return null;
	}
};

// S'inscrire
const register = async (login: string, email: string, password: string): Promise<{ token: string; user: { id: string; login: string; email: string } }> => {
	// Vérifier si l'email existe déjà
	const existingUser = await UserService.getByEmail(email);
	if (existingUser) {
		throw new Error("Email already exists");
	}

	// Créer l'utilisateur
	const userData = await UserService.create(login, email, password);
	// Générer le token JWT
	const token = generateToken({
		id: userData.id,
		email: userData.email,
		login: userData.login,
	});

	return {
		token,
		user: {
			id: userData.id,
			login: userData.login,
			email: userData.email,
		},
	};
};

// Se connecter
const login = async (email: string, password: string): Promise<{ token: string; user: { id: string; login: string; email: string } }> => {
	// Vérifier les identifiants
	const userData = await UserService.verifyCredentials(email, password);
	if (!userData) {
		throw new Error("Invalid email or password");
	}

	// Générer le token JWT
	const token = generateToken({
		id: userData.id,
		email: userData.email,
		login: userData.login,
	});

	return {
		token,
		user: {
			id: userData.id,
			login: userData.login,
			email: userData.email,
		},
	};
};

export default {
	login,
	register,
	isLogged,
	getUserFromRequest,
	cookieName,
	getToken,
};
