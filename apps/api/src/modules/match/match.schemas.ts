import { z } from "zod";
import { GameWinner } from "../../generated/prisma/client.js";

export const historyPlayerSchema = z.object({
	id: z.string(),
	login: z.string(),
});

export const gameHistorySchema = z.object({
	id: z.string(),
	player1: historyPlayerSchema,
	player2: historyPlayerSchema,
	winner: z.enum(GameWinner),
	/** Date de fin de partie, en millisecondes epoch. */
	time: z.number().int(),
	/** Durée de la partie en secondes. */
	duration: z.number().int(),
});

export const gameHistoryQuerySchema = z.object({
	limit: z.coerce.number().int().positive().max(100).optional(),
});
