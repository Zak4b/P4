import { UserService } from "../user/user.service.js";
import { generateToken } from "./jwt.js";

type AuthResult = { token: string; user: { id: string; login: string; email: string } };

export class AuthService {
	private static buildAuthResult(userData: { id: string; login: string; email: string }): AuthResult {
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
	}

	/** Inscription */
	static async register(login: string, email: string, password: string): Promise<AuthResult> {
		const existingUser = await UserService.find({ email });
		if (existingUser) {
			throw new Error("Email already exists");
		}

		const userData = await UserService.create(login, email, password);
		return AuthService.buildAuthResult(userData);
	}

	/** Connexion (email/password) */
	static async login(email: string, password: string): Promise<AuthResult> {
		const userData = await UserService.verifyCredentials(email, password);
		if (!userData) {
			throw new Error("Invalid email or password");
		}

		return AuthService.buildAuthResult(userData);
	}

	/** Connexion / inscription via Google OAuth */
	static async loginWithGoogle(googleId: string, email: string, displayName: string): Promise<AuthResult> {
		const userData = await UserService.findOrCreateByGoogle(googleId, email, displayName);
		return AuthService.buildAuthResult(userData);
	}
}
