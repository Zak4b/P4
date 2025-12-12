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
	
	async function save(id1: string, id2: string, result: GameWinner, duration: number, board: any) {
		if (id1 && id2) {
			await prisma.game.create({
				data: {
					player1Id: id1,
					player2Id: id2,
					winner: result,
					moves: board, 
					duration: duration, 
				},
			});
		} else {
			throw new Error("Players not found");
		}
	};

	async function updatePlayerElos(
		player1Id: string,
		player2Id: string,
		winner: GameWinner
	): Promise<[number, number]> {
		const { elo1, elo2 } = await getPlayersElos(player1Id, player2Id);

		const [newElo1, newElo2] = calculateNewElo(elo1, elo2, winner);

		await prisma.$transaction([
			prisma.user.update({
				where: { id: player1Id },
				data: { eloRating: newElo1 },
			}),
			prisma.user.update({
				where: { id: player2Id },
				data: { eloRating: newElo2 },
			}),
		]);
		return [newElo1, newElo2];
	}

	export async function finalizeFromRoom(
		registeredPlayers: Array<{ uuid: string; playerId: number }>,
		win: number,
		duration: number,
		board: any
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
		try {
			await updatePlayerElos(p1.uuid, p2.uuid, winner);
		} catch (error) {
			console.error("Erreur lors de la mise à jour des scores ELO:", error);
		}
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
