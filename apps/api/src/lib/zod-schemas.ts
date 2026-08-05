import { z } from "zod";

const roomIdSchema = z
	.string()
	.regex(/^[\w0-9]+$/)
	.min(1);

export const clientMessageSchema = z.discriminatedUnion("type", [
	z.object({ type: z.literal("leave") }),
	z.object({ type: z.literal("matchmaking-join") }),
	z.object({ type: z.literal("matchmaking-leave") }),
	z.object({ type: z.literal("join"), data: z.object({ roomId: roomIdSchema }) }),
	z.object({ type: z.literal("play"), data: z.object({ x: z.number().int().min(0).max(6) }) }),
	z.object({ type: z.literal("restart") }),
	z.object({ type: z.literal("message"), data: z.object({ text: z.string().min(1) }) }),
]);
// Schema pour l'inscription
export const registerSchema = z.object({
	login: z.string().min(1).max(100),
	email: z.email().transform((email) => email.toLowerCase()),
	password: z.string().min(8).max(100),
});

// Schema pour la connexion
export const loginSchema = z.object({
	email: z.string(),
	password: z.string().min(1),
});

/** Position/état de plateau envoyé au(x) joueur(s) lors d'un "sync" (rejoin, restart, swap...) */
const syncDataSchema = z.object({
	playerId: z.number().nullable(),
	cPlayer: z.number(),
	board: z.array(z.array(z.number())).optional(),
	last: z.object({ x: z.number(), y: z.number() }).optional(),
});

/** Référence légère à un joueur dans une room (id local + nom affiché) */
const roomPlayerRefSchema = z.object({
	localId: z.number(),
	name: z.string(),
});

export const serverMessageSchema = z.discriminatedUnion("type", [
	z.object({ type: z.literal("registered"), data: z.string() }),
	z.object({ type: z.literal("players"), data: z.array(roomPlayerRefSchema) }),
	z.object({ type: z.literal("sync"), data: syncDataSchema }),
	z.object({ type: z.literal("player-joined"), data: roomPlayerRefSchema }),
	z.object({ type: z.literal("info"), data: z.string() }),
	z.object({ type: z.literal("vote"), data: z.object({ text: z.string(), command: z.string() }) }),
	z.object({
		type: z.literal("matched"),
		data: z.object({ roomId: z.string(), playerId: z.number().nullable() }),
	}),
	z.object({
		type: z.literal("play"),
		data: z.object({ playerId: z.number(), x: z.number(), y: z.number(), nextPlayerId: z.number() }),
	}),
	z.object({ type: z.literal("game-draw"), data: z.undefined().optional() }),
	z.object({ type: z.literal("game-win"), data: z.object({ uuid: z.string(), playerid: z.number() }) }),
	z.object({ type: z.literal("error"), data: z.object({ message: z.string() }) }),
	z.object({
		type: z.literal("message"),
		data: z.object({ clientId: z.string(), displayName: z.string(), message: z.string() }),
	}),
]);
