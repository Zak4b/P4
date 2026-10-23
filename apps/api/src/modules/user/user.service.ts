import { Prisma } from "../../generated/prisma/client.js";
import { UserRepository } from "./user.repository.js";
import { hashPassword, comparePassword } from "../auth/password.js";
import { HttpError } from "../../lib/HttpError.js";
import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from "@p4/schemas/auth";
import crypto from "node:crypto";

const USERNAME_SUFFIX_LENGTH = 7;
function generateUsername(raw: string): string {
	const base = raw
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-zA-Z0-9_.-]+/g, "_")
		.replace(/^_+|_+$/g, "")
		.slice(0, USERNAME_MAX_LENGTH - USERNAME_SUFFIX_LENGTH);
	const suffix = crypto.randomUUID().slice(0, USERNAME_SUFFIX_LENGTH - 1);
	return `${base.length >= USERNAME_MIN_LENGTH ? base : "joueur"}_${suffix}`;
}

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
		if (!user) {
			return null;
		}

		const stats = await UserService.getStats(user.id);
		if (!stats) {
			return null;
		}

		return {
			id: user.id,
			username: user.username,
			email: user.email,
			eloRating: user.eloRating,
			xp: user.xp,
			stats,
		};
	}

	static async create(username: string, email: string, passwordPlain: string) {
		const password = await hashPassword(passwordPlain);
		const user = await UserRepository.createRecord(username, email, password);
		return user;
	}

	static async verifyCredentials(email: string, passwordPlain: string) {
		const user = await UserService.find({ email });
		if (!user) {
			return null;
		}

		const isValid = await comparePassword(passwordPlain, user.password);
		if (!isValid) {
			return null;
		}

		return user;
	}

	/** Trouver ou créer un utilisateur à partir du profil Google */
	static async findOrCreateByGoogle(googleId: string, email: string, displayName: string) {
		let user = await UserService.find({ googleId });
		if (user) {
			return user;
		}

		user = await UserService.find({ email });
		if (user) {
			return await UserRepository.setGoogleId(user.id, googleId);
		}

		const username = generateUsername((displayName || email.split("@")[0]) ?? "");

		const randomPassword = crypto.randomBytes(32).toString("hex");
		const password = await hashPassword(randomPassword);

		return await UserRepository.createRecord(username, email, password, googleId);
	}

	static async changeUsername(id: string, username: string) {
		return await UserRepository.updateUsername(id, username);
	}

	private static async assertPassword(id: string, passwordPlain: string) {
		const user = await UserRepository.find({ id });
		if (!user) {
			throw HttpError.unauthorized("Session user no longer exists");
		}
		if (!(await comparePassword(passwordPlain, user.password))) {
			throw HttpError.forbidden("Invalid password");
		}
	}

	static async changeEmail(id: string, email: string, currentPassword: string) {
		await UserService.assertPassword(id, currentPassword);
		return await UserRepository.updateEmail(id, email);
	}

	static async changePassword(id: string, currentPassword: string, newPassword: string) {
		await UserService.assertPassword(id, currentPassword);
		await UserRepository.updatePassword(id, await hashPassword(newPassword));
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
