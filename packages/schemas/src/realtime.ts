import { z } from "zod";

export const roomIdSchema = z
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

export const syncDataSchema = z.object({
	playerId: z.number().nullable(),
	cPlayer: z.number(),
	board: z.array(z.array(z.number())).optional(),
	last: z.object({ x: z.number(), y: z.number() }).optional(),
});

export const roomPlayerRefSchema = z.object({
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

export const joinAckSchema = z.object({
	success: z.boolean(),
	roomId: z.string().optional(),
	playerId: z.number().optional(),
	error: z.string().optional(),
});

export const messageAckSchema = z.object({
	success: z.boolean(),
	message: z.string().optional(),
});

export type ClientMessage = z.infer<typeof clientMessageSchema>;
export type ServerMessage = z.infer<typeof serverMessageSchema>;

export type JoinAck = z.infer<typeof joinAckSchema>;
export type MessageAck = z.infer<typeof messageAckSchema>;

export type SyncData = z.infer<typeof syncDataSchema>;
export type RoomPlayerRef = z.infer<typeof roomPlayerRefSchema>;

export type ServerMessageData<T extends ServerMessage["type"]> =
	Extract<ServerMessage, { type: T }> extends { data?: infer D } ? D : never;

/** Idem pour les messages émis par le client. */
export type ClientMessageData<T extends ClientMessage["type"]> =
	Extract<ClientMessage, { type: T }> extends { data?: infer D } ? D : never;
