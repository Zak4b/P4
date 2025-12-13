import { prisma } from "../lib/prisma.js";
import { GameWinner, Prisma } from "@prisma/client";
import { calculateNewElo } from "../lib/elo.js";

export namespace GameService {

	async function getPlayersElos(
		player1Id: string,
		player2Id: string
	): Promise<{ elo1: number; elo2: number }> {
		const users = await prisma.user.findMany({
			where: { id: { in: [player1Id, player2Id] } },
			select: { id: true, eloRating: true },
		});

		const player1 = users.find((user) => user.id === player1Id);
		const player2 = users.find((user) => user.id === player2Id);

		if (!player1 || !player2) {
			throw new Error("Both players must exist to update ELO ratings");
		}

		return { elo1: player1.eloRating, elo2: player2.eloRating };
	}
	
	async function save(id1: string, id2: string, result: GameWinner, duration: number, board: Prisma.JsonValue) {
		if (id1 && id2) { // TODO check for empty room / missing players
			const { elo1, elo2 } = await getPlayersElos(id1, id2);

			const {1: newElo1, 2: newElo2, delta1, delta2} = calculateNewElo(elo1, elo2, result);
	
			await prisma.$transaction([
				prisma.game.create({
					data: {
						player1Id: id1,
						player2Id: id2,
						eloDelta1: delta1,
						eloDelta2: delta2,
						winner: result,
						moves: board, 
						duration: duration, 
					},
				}),
				prisma.user.update({
					where: { id: id1 },
					data: { eloRating: newElo1 },
				}),
				prisma.user.update({
					where: { id: id2 },
					data: { eloRating: newElo2 },
				}),
			]);
		} else {
			throw new Error("Players not found");
		}
	};

	export async function finalizeFromRoom(
		registeredPlayers: Array<{ uuid: string; playerId: number }>,
		win: number,
		duration: number,
		board: Prisma.JsonValue
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

		await save(p1.uuid, p2.uuid, winner, duration, board);
	};

	export async function history({playerId, limit}: {playerId?: string, limit?: number}) {
		const where: Prisma.GameWhereInput = {};
		if (playerId) {
			where.OR = [
				{ player1Id: playerId },
				{ player2Id: playerId },
			];
		}
		const games = await prisma.game.findMany({
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

		return games.map((game) => {
			return {
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
			};
		});
	};
}
