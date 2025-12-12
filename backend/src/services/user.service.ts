import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { hashPassword, comparePassword } from "../lib/password.js";

export namespace UserService {
	export const getById = async (id: string) => {
		return await prisma.user.findUnique({
			where: { id },
		});
	};

	export const getByLogin = async (login: string) => {
		return await prisma.user.findUnique({
			where: { login },
		});
	};
		
	export const getByEmail = async (email: string) => {
		return await prisma.user.findUnique({
			where: { email },
		});
	};

	export const getStats = async (id: string) => {
		const user = await prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				eloRating: true,
			},
		});
		if (!user) {
			return null;
		}

		const [stats] = await prisma.$queryRaw<Array<{
			totalGames: bigint;
			wins: bigint;
			losses: bigint;
			draws: bigint;
		}>>(Prisma.sql`
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
			totalGames: Number(stats.totalGames),
			wins: Number(stats.wins),
			losses: Number(stats.losses),
			draws: Number(stats.draws),
		};
	};
	
	export const create = async (login: string, email: string, passwordPlain: string) => {
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
	
	export const verifyCredentials = async (email: string, passwordPlain: string) => {
		const user = await getByEmail(email);
		if (!user) return null;
	
		const isValid = await comparePassword(passwordPlain, user.password);
		if (!isValid) return null;
	
		return user;
	};
	
	export const listAll = async () => {
		return await prisma.user.findMany({
			select: {
				login: true,
				eloRating: true,
			},
		});
	};

	export const getLeaderboard = async (limit: number = 10) => {
		return await prisma.user.findMany({
			select: {
				id: true,
				login: true,
				eloRating: true,
			},
			orderBy: {
				eloRating: "desc",
			},
			take: limit,
		});
	};
	
	export const update = async (id: string, data: any) => {
		return await prisma.user.update({
			where: { id },
			data,
		});
	};
}
