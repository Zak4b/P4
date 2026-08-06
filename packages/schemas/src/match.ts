import { z } from "zod";
import { userIdentitySchema } from "./auth.js";

export const gameWinnerSchema = z.enum(["DRAW", "PLAYER1", "PLAYER2"]);

export const gameHistorySchema = z.object({
	id: z.string().meta({ example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" }),
	player1: userIdentitySchema,
	player2: userIdentitySchema,
	winner: gameWinnerSchema,
	time: z.number().int().meta({ example: 1786026731000 }),
	duration: z.number().int().meta({ example: 245 }),
});

export const gameHistoryQuerySchema = z.object({
	limit: z.coerce.number().int().positive().max(100).optional().meta({ example: 20 }),
});

export type GameWinnerValue = z.infer<typeof gameWinnerSchema>;
export type GameHistory = z.infer<typeof gameHistorySchema>;
export type GameHistoryQuery = z.infer<typeof gameHistoryQuerySchema>;
