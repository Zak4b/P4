import { z } from "zod";

// Schema pour créer/rejoindre une partie
export const joinRoomSchema = z.object({
	roomId: z
		.string()
		.regex(/^[\w0-9]+$/)
		.min(1),
});

// Schema pour jouer un coup
export const playMoveSchema = z.object({
	roomId: z
		.string()
		.regex(/^[\w0-9]+$/)
		.min(1),
	x: z.number().int().min(0).max(6),
});

// Schema pour redémarrer une partie
export const restartGameSchema = z.object({
	roomId: z
		.string()
		.regex(/^[\w0-9]+$/)
		.min(1),
	forced: z.boolean().optional(),
});

// Schema pour obtenir l'état d'une partie
export const getGameStateSchema = z.object({
	roomId: z
		.string()
		.regex(/^[\w0-9]+$/)
		.min(1),
});

// Schema pour l'inscription
export const registerSchema = z.object({
	name: z.string().min(1).max(100),
	email: z.string().email(),
	password: z.string().min(8).max(100),
});

// Schema pour la connexion
export const loginSchema = z.object({
	email: z.string(),
	password: z.string().min(1),
});
