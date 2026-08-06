import { z } from "zod";

export const userSchema = z.object({
	id: z.string().meta({ example: "f47ac10b-58cc-4372-a567-0e02b2c3d479" }),
	login: z.string().meta({ example: "alice" }),
	eloRating: z.number().int().meta({ example: 412 }),
	xp: z.number().int().meta({ example: 1250 }),
});

export const userStatsSchema = z.object({
	totalGames: z.number().int().meta({ example: 24 }),
	wins: z.number().int().meta({ example: 13 }),
	losses: z.number().int().meta({ example: 9 }),
	draws: z.number().int().meta({ example: 2 }),
});

export const leaderboardQuerySchema = z.object({
	limit: z.coerce.number().int().positive().max(100).default(10).meta({ example: 10 }),
});

export const userProfileSchema = userSchema.extend({
	stats: userStatsSchema,
});

/** Seul endroit où l'email circule : le sien, jamais celui d'un autre. */
export const meSchema = userProfileSchema.extend({
	email: z.email().meta({ example: "alice@example.com" }),
});

export type User = z.infer<typeof userSchema>;
export type UserStats = z.infer<typeof userStatsSchema>;
export type LeaderboardQuery = z.infer<typeof leaderboardQuerySchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type Me = z.infer<typeof meSchema>;
