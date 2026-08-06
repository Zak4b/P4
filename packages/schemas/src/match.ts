import { z } from "zod";

export const gameWinnerSchema = z.enum(["DRAW", "PLAYER1", "PLAYER2"]);

export const historyPlayerSchema = z.object({
	id: z.string(),
	login: z.string(),
});

export const gameHistorySchema = z.object({
	id: z.string(),
	player1: historyPlayerSchema,
	player2: historyPlayerSchema,
	winner: gameWinnerSchema,
	time: z.number().int(),
	duration: z.number().int(),
});

export const gameHistoryQuerySchema = z.object({
	limit: z.coerce.number().int().positive().max(100).optional(),
});

export type GameWinnerValue = z.infer<typeof gameWinnerSchema>;
export type HistoryPlayer = z.infer<typeof historyPlayerSchema>;
export type GameHistory = z.infer<typeof gameHistorySchema>;
export type GameHistoryQuery = z.infer<typeof gameHistoryQuerySchema>;
