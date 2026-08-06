import { z } from "zod";

/** Statistiques calculées d'un joueur (ELO, XP/niveau, bilan des parties). */
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

/** Entrée de la liste de tous les joueurs. */
export const userRankingEntrySchema = z.object({
	login: z.string(),
	eloRating: z.number().int(),
});

/** Entrée du classement. */
export const leaderboardEntrySchema = z.object({
	id: z.string(),
	login: z.string(),
	eloRating: z.number().int(),
	xp: z.number().int(),
	level: z.number().int(),
});

/** Profil public : identité + statistiques. */
export const userProfileSchema = userStatsSchema.extend({
	id: z.string(),
	login: z.string(),
});

/** Utilisateur complet moins le mot de passe. */
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
