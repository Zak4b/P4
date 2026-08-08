import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

const USER_SELECT = { id: true, login: true, eloRating: true, xp: true } as const;

export class UserRepository {
	static async find(where: Prisma.UserWhereUniqueInput) {
		return await prisma.user.findUnique({ where });
	}

	static async findPublic(id: string) {
		return await prisma.user.findUnique({ where: { id }, select: USER_SELECT });
	}

	static async findAvatarConfig(id: string) {
		return await prisma.user.findUnique({
			where: { id },
			select: { avatarStyle: true, avatarOptions: true },
		});
	}

	static async updateAvatarConfig(id: string, avatarStyle: string, avatarOptions: Prisma.InputJsonValue) {
		return await prisma.user.update({
			where: { id },
			data: { avatarStyle, avatarOptions },
			select: { id: true },
		});
	}

	static async findEloByIds(player1Id: string, player2Id: string) {
		return await prisma.user.findMany({
			where: { id: { in: [player1Id, player2Id] } },
			select: { id: true, eloRating: true },
		});
	}

	static async getGameStatsRaw(userId: string) {
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
					WHEN (player1Id = ${userId} AND winner = 'PLAYER1') OR
						 (player2Id = ${userId} AND winner = 'PLAYER2')
					THEN 1 ELSE 0 END) as wins,
				SUM(CASE
					WHEN (player1Id = ${userId} AND winner = 'PLAYER2') OR
						 (player2Id = ${userId} AND winner = 'PLAYER1')
					THEN 1 ELSE 0 END) as losses,
				SUM(CASE
					WHEN winner = 'DRAW' AND (player1Id = ${userId} OR player2Id = ${userId})
					THEN 1 ELSE 0 END) as draws
			FROM Game
			WHERE player1Id = ${userId} OR player2Id = ${userId}
		`);
		return stats ?? { totalGames: 0n, wins: 0n, losses: 0n, draws: 0n };
	}

	static async createRecord(login: string, email: string, password: string, googleId?: string) {
		return await prisma.user.create({
			data: { login, email, password, ...(googleId ? { googleId } : {}) },
		});
	}

	static async setGoogleId(id: string, googleId: string) {
		return await prisma.user.update({
			where: { id },
			data: { googleId },
		});
	}

	static async findAllRanking() {
		return await prisma.user.findMany({
			select: USER_SELECT,
		});
	}

	static async findLeaderboard(limit: number) {
		return await prisma.user.findMany({
			select: USER_SELECT,
			where: {
				xp: { gt: 0 },
			},
			orderBy: {
				eloRating: "desc",
			},
			take: limit,
		});
	}

	static async updateRecord(id: string, data: Prisma.UserUpdateInput) {
		return await prisma.user.update({
			where: { id },
			data,
		});
	}
}
