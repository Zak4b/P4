import { prisma } from "../../lib/prisma.js";
import { GameWinner, Prisma } from "../../generated/prisma/client.js";

export interface GameRecordInput {
	player1Id: string;
	player2Id: string;
	eloDelta1: number;
	eloDelta2: number;
	winner: GameWinner;
	moves: Prisma.InputJsonValue;
	duration: number;
}

export interface EloUpdate {
	eloRating: number;
	xpGain: number;
}

export class GameHistoryRepository {
	static async create(game: GameRecordInput, player1Update: EloUpdate, player2Update: EloUpdate) {
		await prisma.$transaction([
			prisma.game.create({
				data: {
					player1Id: game.player1Id,
					player2Id: game.player2Id,
					eloDelta1: game.eloDelta1,
					eloDelta2: game.eloDelta2,
					winner: game.winner,
					moves: game.moves,
					duration: game.duration,
				},
			}),
			prisma.user.update({
				where: { id: game.player1Id },
				data: { eloRating: player1Update.eloRating, xp: { increment: player1Update.xpGain } },
			}),
			prisma.user.update({
				where: { id: game.player2Id },
				data: { eloRating: player2Update.eloRating, xp: { increment: player2Update.xpGain } },
			}),
		]);
	}

	static async findMany(where: Prisma.GameWhereInput, limit?: number) {
		return await prisma.game.findMany({
			where,
			select: {
				id: true,
				winner: true,
				createdAt: true,
				duration: true,
				player1Id: true,
				player2Id: true,
				player1: { select: { login: true } },
				player2: { select: { login: true } },
			},
			orderBy: { createdAt: "desc" },
			take: limit,
		});
	}
}
