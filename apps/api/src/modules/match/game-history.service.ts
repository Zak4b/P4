import { GameWinner, Prisma } from "../../generated/prisma/client.js";
import { GameHistoryRepository } from "./game-history.repository.js";
import { UserRepository } from "../user/user.repository.js";
import { calculateNewElo } from "./elo.js";
import { calculateXpGain } from "./xp.js";

export class GameHistoryService {
	private static async getPlayersElos(player1Id: string, player2Id: string): Promise<{ elo1: number; elo2: number }> {
		const users = await UserRepository.findEloByIds(player1Id, player2Id);

		const player1 = users.find((user) => user.id === player1Id);
		const player2 = users.find((user) => user.id === player2Id);

		if (!player1 || !player2) {
			throw new Error("Both players must exist to update ELO ratings");
		}

		return { elo1: player1.eloRating, elo2: player2.eloRating };
	}

	private static getXpGains(result: GameWinner): { xp1: number; xp2: number } {
		return {
			xp1: calculateXpGain(result, true),
			xp2: calculateXpGain(result, false),
		};
	}

	private static async _save(
		id1: string,
		id2: string,
		result: GameWinner,
		duration: number,
		board: Prisma.InputJsonValue,
	) {
		if (id1 && id2) {
			// TODO check for empty room / missing players
			const { elo1, elo2 } = await GameHistoryService.getPlayersElos(id1, id2);
			const { xp1, xp2 } = GameHistoryService.getXpGains(result);

			const { 1: newElo1, 2: newElo2, delta1, delta2 } = calculateNewElo(elo1, elo2, result);

			await GameHistoryRepository.create(
				{
					player1Id: id1,
					player2Id: id2,
					eloDelta1: delta1,
					eloDelta2: delta2,
					winner: result,
					moves: board,
					duration: duration,
				},
				{ eloRating: newElo1, xpGain: xp1 },
				{ eloRating: newElo2, xpGain: xp2 },
			);
		} else {
			throw new Error("Players not found");
		}
	}

	static async save(
		registeredPlayers: Array<{ uuid: string; playerId: number }>,
		win: number,
		duration: number,
		board: Prisma.InputJsonValue,
	) {
		const p1 = registeredPlayers.find((p) => p.playerId === 1);
		const p2 = registeredPlayers.find((p) => p.playerId === 2);
		if (!p1 || !p2 || !p1.uuid || !p2.uuid) {
			return;
		}

		let winner: GameWinner = GameWinner.DRAW;
		if (win === 1) {
			winner = GameWinner.PLAYER1;
		} else if (win === 2) {
			winner = GameWinner.PLAYER2;
		}

		await GameHistoryService._save(p1.uuid, p2.uuid, winner, duration, board);
	}

	static async get({ playerId, limit }: { playerId?: string; limit?: number }) {
		const where: Prisma.GameWhereInput = {};
		if (playerId) {
			where.OR = [{ player1Id: playerId }, { player2Id: playerId }];
		}
		const games = await GameHistoryRepository.findMany(where, limit);

		return games.map((game) => ({
			id: game.id,
			player1: {
				id: game.player1Id,
				login: game.player1.login,
			},
			player2: {
				id: game.player2Id,
				login: game.player2.login,
			},
			winner: game.winner,
			time: game.createdAt.getTime(),
			duration: game.duration,
		}));
	}
}
