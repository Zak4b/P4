import { prisma } from "../lib/prisma.js";
import { GameWinner, Prisma } from "@prisma/client";
import { updatePlayerElos } from "../lib/elo.js";

const save = async (id1: string, id2: string, result: GameWinner, board: any) => {
	if (id1 && id2) {
		await prisma.game.create({
			data: {
				player1Id: id1,
				player2Id: id2,
				winner: result,
				moves: board, 
				duration: 0, 
			},
		});
	} else {
		throw new Error("Players not found");
	}
};

const finalizeFromRoom = async (
	registeredPlayers: Array<{ uuid: string; playerId: number }>,
	win: number,
	board: any
) => {
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

	await save(p1.uuid, p2.uuid, winner, board);
	try {
		await updatePlayerElos(p1.uuid, p2.uuid, winner);
	} catch (error) {
		console.error("Erreur lors de la mise à jour des scores ELO:", error);
	}
};

const playerScore = async () => {
	const games = await prisma.game.findMany({
		where: {
			winner: {
				in: [GameWinner.PLAYER1, GameWinner.PLAYER2],
			},
		},
	});

	const winsMap = new Map<string, Map<string, number>>();
	
	for (const game of games) {
		const winnerId = game.winner === GameWinner.PLAYER1 ? game.player1Id : game.player2Id;
		const loserId = game.winner === GameWinner.PLAYER1 ? game.player2Id : game.player1Id;
		
		if (!winsMap.has(winnerId)) {
			winsMap.set(winnerId, new Map());
		}
		const opponentMap = winsMap.get(winnerId)!;
		opponentMap.set(loserId, (opponentMap.get(loserId) || 0) + 1);
	}
	
	const result: Array<{ p: string; e: string; count: number }> = [];
	for (const [p, opponentMap] of winsMap) {
		for (const [e, count] of opponentMap) {
			result.push({ p, e, count });
		}
	}
	
	return result;
};

const history = async (limit?: number) => {
	const games = await prisma.game.findMany({
		include: {
			player1: {
				select: { login: true },
			},
			player2: {
				select: { login: true },
			},
		},
		orderBy: { createdAt: "desc" },
		take: limit,
	});

	return games.map((game) => {
		return {
			id: game.id,
			player1: {
				id: game.player1Id,
				login: game.player1?.login ?? game.player1Id,
			},
			player2: {
				id: game.player2Id,
				login: game.player2?.login ?? game.player2Id,
			},
			winner: game.winner,
			board: game.moves,
			time: game.createdAt.getTime(),
			duration: game.duration,
		};
	});
};

export default { playerScore, history, finalizeFromRoom };
