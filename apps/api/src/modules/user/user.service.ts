import { Prisma } from "../../generated/prisma/client.js";
import { UserRepository } from "./user.repository.js";
import { hashPassword, comparePassword } from "../auth/password.js";
import crypto from "node:crypto";

export class UserService {
	static async find(where: Prisma.UserWhereUniqueInput) {
		return await UserRepository.find(where);
	}

	static async getById(id: string) {
		return await UserRepository.findPublic(id);
	}

	static async getStats(id: string) {
		const user = await UserRepository.find({ id });
		if (!user) {
			return null;
		}

		const stats = await UserRepository.getGameStatsRaw(user.id);

		return {
			totalGames: Number(stats.totalGames),
			wins: Number(stats.wins),
			losses: Number(stats.losses),
			draws: Number(stats.draws),
		};
	}

	static async getMe(id: string) {
		const user = await UserRepository.find({ id });
		if (!user) return null;

		const stats = await UserService.getStats(user.id);
		if (!stats) return null;

		return {
			id: user.id,
			login: user.login,
			email: user.email,
			eloRating: user.eloRating,
			xp: user.xp,
			stats,
		};
	}

	static async create(login: string, email: string, passwordPlain: string) {
		const password = await hashPassword(passwordPlain);
		const user = await UserRepository.createRecord(login, email, password);
		return user;
	}

	static async verifyCredentials(email: string, passwordPlain: string) {
		const user = await UserService.find({ email });
		if (!user) return null;

		const isValid = await comparePassword(passwordPlain, user.password);
		if (!isValid) return null;

		return user;
	}

	/** Trouver ou créer un utilisateur à partir du profil Google */
	static async findOrCreateByGoogle(googleId: string, email: string, displayName: string) {
		let user = await UserService.find({ googleId });
		if (user) return user;

		user = await UserService.find({ email });
		if (user) {
			return await UserRepository.setGoogleId(user.id, googleId);
		}

		const baseLogin = (displayName || email.split("@")[0] || "user").replace(/\s+/g, "_").slice(0, 35);
		let login = baseLogin;
		let suffix = 0;
		while (await UserService.find({ login })) {
			login = `${baseLogin}_${++suffix}`.slice(0, 40);
		}

		const randomPassword = crypto.randomBytes(32).toString("hex");
		const password = await hashPassword(randomPassword);

		return await UserRepository.createRecord(login, email, password, googleId);
	}

	static async listAll() {
		return await UserRepository.findAllRanking();
	}

	static async getLeaderboard(limit: number = 10) {
		return await UserRepository.findLeaderboard(limit);
	}

	static async update(id: string, data: Prisma.UserUpdateInput) {
		return await UserRepository.updateRecord(id, data);
	}
}
