import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { hashPassword, comparePassword } from "../lib/password.js";
import { getLevelFromXp } from "../lib/xp.js";
import crypto from "node:crypto";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const getUserById = async (id: string) => {
	return await prisma.user.findUnique({
		where: { id },
	});
};

export const getUserByLogin = async (login: string) => {
	return await prisma.user.findUnique({
		where: { login },
	});
};

/** Trouve un utilisateur par id (UUID) ou par login */
export const getUserByIdOrLogin = async (identifier: string) => {
	if (UUID_REGEX.test(identifier)) {
		return await getUserById(identifier);
	}
	return await getUserByLogin(identifier);
};

export const getUserByEmail = async (email: string) => {
	return await prisma.user.findUnique({
		where: { email },
	});
};

export const getUserStats = async (id: string) => {
	const user = await prisma.user.findUnique({
		where: { id },
		select: {
			id: true,
			eloRating: true,
			xp: true,
		},
	});
	if (!user) {
		return null;
	}

	const levelInfo = getLevelFromXp(user.xp);

	const [stats] = await prisma.$queryRaw<
			Array<{
				totalGames: bigint;
				wins: bigint;
				losses: bigint;
				draws: bigint;
			}>
	>(Prisma.sql`
		SELECT 
			COUNT(*) as totalGames,
			SUM(CASE 
				WHEN (player1Id = ${user.id} AND winner = 'PLAYER1') OR 
					 (player2Id = ${user.id} AND winner = 'PLAYER2') 
				THEN 1 ELSE 0 END) as wins,
			SUM(CASE 
				WHEN (player1Id = ${user.id} AND winner = 'PLAYER2') OR 
					 (player2Id = ${user.id} AND winner = 'PLAYER1') 
				THEN 1 ELSE 0 END) as losses,
			SUM(CASE 
				WHEN winner = 'DRAW' AND (player1Id = ${user.id} OR player2Id = ${user.id})
				THEN 1 ELSE 0 END) as draws
		FROM Game
		WHERE player1Id = ${user.id} OR player2Id = ${user.id}
	`);

	return {
		eloRating: user.eloRating,
		xp: user.xp,
		level: levelInfo.level,
		xpInCurrentLevel: levelInfo.xpInCurrentLevel,
		xpRequiredForNextLevel: levelInfo.xpRequiredForNextLevel,
		totalGames: Number(stats.totalGames),
		wins: Number(stats.wins),
		losses: Number(stats.losses),
		draws: Number(stats.draws),
	};
};

/** Profil public d'un joueur (id ou login) - sans données sensibles */
export const getUserProfile = async (identifier: string) => {
	const user = await getUserByIdOrLogin(identifier);
	if (!user) return null;

	const stats = await getUserStats(user.id);
	if (!stats) return null;

	return {
		id: user.id,
		login: user.login,
		...stats,
	};
};

export const createUser = async (login: string, email: string, passwordPlain: string) => {
	const password = await hashPassword(passwordPlain);
	const user = await prisma.user.create({
		data: {
			login,
			email,
			password,
		},
	});
	return user;
};

export const verifyUserCredentials = async (email: string, passwordPlain: string) => {
	const user = await getUserByEmail(email);
	if (!user) return null;

	const isValid = await comparePassword(passwordPlain, user.password);
	if (!isValid) return null;

	return user;
};

/** Trouver ou créer un utilisateur à partir du profil Google */
export const findOrCreateUserByGoogle = async (googleId: string, email: string, displayName: string) => {
	let user = await prisma.user.findUnique({ where: { googleId } });
	if (user) return user;

	user = await getUserByEmail(email);
	if (user) {
		return await prisma.user.update({
			where: { id: user.id },
			data: { googleId },
		});
	}

	const baseLogin = (displayName || email.split("@")[0] || "user").replace(/\s+/g, "_").slice(0, 35);
	let login = baseLogin;
	let suffix = 0;
	while (await getUserByLogin(login)) {
		login = `${baseLogin}_${++suffix}`.slice(0, 40);
	}

	const randomPassword = crypto.randomBytes(32).toString("hex");
	const password = await hashPassword(randomPassword);

	return await prisma.user.create({
		data: { login, email, password, googleId },
	});
};

export const listAllUsers = async () => {
	return await prisma.user.findMany({
		select: {
			login: true,
			eloRating: true,
		},
	});
};

export const getUserLeaderboard = async (limit: number = 10) => {
	const users = await prisma.user.findMany({
		select: {
			id: true,
			login: true,
			eloRating: true,
			xp: true,
		},
		where: {
			xp: { gt: 0 },
		},
		orderBy: {
			eloRating: "desc",
		},
		take: limit,
	});
	return users.map((u) => ({
		...u,
		level: getLevelFromXp(u.xp).level,
	}));
};

export const updateUser = async (id: string, data: Prisma.UserUpdateInput) => {
	return await prisma.user.update({
		where: { id },
		data,
	});
};
