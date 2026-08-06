import { z } from "zod";

export const userStatsSchema = z.object({
	eloRating: z.number().int(),
	xp: z.number().int(),
	level: z.number().int(),
	xpInCurrentLevel: z.number().int(),
	xpRequiredForNextLevel: z.number().int(),
	totalGames: z.number().int(),
	wins: z.number().int(),
	losses: z.number().int(),
	draws: z.number().int(),
});

export const userRankingEntrySchema = z.object({
	login: z.string(),
	eloRating: z.number().int(),
});

export const leaderboardEntrySchema = z.object({
	id: z.string(),
	login: z.string(),
	eloRating: z.number().int(),
	xp: z.number().int(),
	level: z.number().int(),
});

export const userProfileSchema = userStatsSchema.extend({
	id: z.string(),
	login: z.string(),
});

export const safeUserSchema = z.object({
	id: z.string(),
	login: z.string(),
	email: z.string(),
	googleId: z.string().nullable(),
	eloRating: z.number().int(),
	xp: z.number().int(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

/** `:id` accepte indifféremment un UUID ou un login. */
export const userIdParamsSchema = z.object({
	id: z.string().min(1).max(64),
});

export type UserStats = z.infer<typeof userStatsSchema>;
export type UserRankingEntry = z.infer<typeof userRankingEntrySchema>;
export type LeaderboardEntry = z.infer<typeof leaderboardEntrySchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type SafeUser = z.infer<typeof safeUserSchema>;
export type UserIdParams = z.infer<typeof userIdParamsSchema>;
