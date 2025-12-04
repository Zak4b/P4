import { prisma } from "../lib/prisma.js";
import user from "./user.js";

const save = async (uuid1: string, uuid2: string, result: number, board: any) => {
	const id1 = await user.get(uuid1);
	const id2 = await user.get(uuid2);
	if (id1 && id2) {
		await prisma.game.create({
			data: {
				player1: id1,
				player2: id2,
				result,
				board: typeof board === "string" ? board : JSON.stringify(board),
				time: BigInt(Date.now()),
			},
		});
	} else {
		throw new Error("Players not found");
	}
};

const playerScore = async () => {
	const games = await prisma.game.findMany({
		where: {
			result: {
				in: [1, 2],
			},
		},
	});

	const winsMap = new Map<number, Map<number, number>>();
	
	for (const game of games) {
		const winner = game.result === 1 ? game.player1 : game.player2;
		const loser = game.result === 1 ? game.player2 : game.player1;
		
		if (!winsMap.has(winner)) {
			winsMap.set(winner, new Map());
		}
		const opponentMap = winsMap.get(winner)!;
		opponentMap.set(loser, (opponentMap.get(loser) || 0) + 1);
	}
	
	const result: Array<{ p: number; e: number; count: number }> = [];
	for (const [p, opponentMap] of winsMap) {
		for (const [e, count] of opponentMap) {
			result.push({ p, e, count });
		}
	}
	
	return result;
};

const history = async (limit?: number, startFrom?: number) => {
	const where = startFrom ? { id: { lt: startFrom } } : {};
	const games = await prisma.game.findMany({
		where,
		include: {
			player1User: {
				select: { name: true },
			},
			player2User: {
				select: { name: true },
			},
		},
		orderBy: { id: "desc" },
		take: limit,
	});

	type GameWithUsers = {
		id: number;
		player1: number;
		player2: number;
		result: number;
		board: string;
		time: bigint;
		player1User: { name: string };
		player2User: { name: string };
	};

	return games.map((game: GameWithUsers) => ({
		id: game.id,
		player_1: game.player1,
		player_2: game.player2,
		result: game.result,
		board: JSON.parse(game.board),
		time: Number(game.time),
		name_1: game.player1User.name,
		name_2: game.player2User.name,
	}));
};

export default { save, playerScore, history };
