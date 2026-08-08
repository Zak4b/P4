import { z } from "zod";
import { userIdentitySchema } from "./auth.js";

export const matchResultSchema = z.enum(["DRAW", "PLAYER1", "PLAYER2"]);

export const matchSchema = z.object({
	id: z.string().meta({ example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" }),
	player1: userIdentitySchema,
	player2: userIdentitySchema,
	winner: matchResultSchema,
	time: z.number().int().meta({ example: 1786026731000 }),
	duration: z.number().int().meta({ example: 245 }),
});

export const matchQuerySchema = z.object({
	limit: z.coerce.number().int().positive().max(100).optional().meta({ example: 20 }),
});

export type MatchResult = z.infer<typeof matchResultSchema>;
export type Match = z.infer<typeof matchSchema>;
export type MatchQuery = z.infer<typeof matchQuerySchema>;
