import { UserService } from "../user/user.service.js";
import { generateToken } from "./jwt.js";
import { HttpError } from "../../lib/HttpError.js";
import type { User } from "@p4/schemas/user";

type AuthResult = { token: string; user: User };

export class AuthService {
	private static buildAuthResult(userData: User & { email: string }): AuthResult {
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
				eloRating: userData.eloRating,
				xp: userData.xp,
			},
		};
	}

	/** Inscription */
	static async register(login: string, email: string, password: string): Promise<AuthResult> {
		const existingUser = await UserService.find({ email });
		if (existingUser) {
			throw HttpError.conflict("Email already exists");
		}

		const userData = await UserService.create(login, email, password);
		return AuthService.buildAuthResult(userData);
	}

	/** Connexion (email/password) */
	static async login(email: string, password: string): Promise<AuthResult> {
		const userData = await UserService.verifyCredentials(email, password);
		if (!userData) {
			throw HttpError.unauthorized("Invalid email or password");
		}

		return AuthService.buildAuthResult(userData);
	}

	/** Connexion / inscription via Google OAuth */
	static async loginWithGoogle(googleId: string, email: string, displayName: string): Promise<AuthResult> {
		const userData = await UserService.findOrCreateByGoogle(googleId, email, displayName);
		return AuthService.buildAuthResult(userData);
	}
}
