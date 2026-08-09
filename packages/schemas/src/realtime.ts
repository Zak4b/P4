import { z } from "zod";
import { userIdentitySchema } from "./auth.js";

/** Accepte les ids générés (UUID avec tirets) et les ids saisis par l'utilisateur */
export const roomIdSchema = z
	.string()
	.regex(/^[\w-]+$/)
	.min(1)
	.max(64);

export const BOARD_COLS = 7;
export const BOARD_ROWS = 6;

// --- Payloads des événements client -> serveur (validés avec zod côté api uniquement) ---

export const playPayloadSchema = z
	.number()
	.int()
	.min(0)
	.max(BOARD_COLS - 1);
export const chatMessagePayloadSchema = z.string().trim().min(1).max(500);

export const syncDataSchema = z.object({
	playerId: z.number().nullable(),
	cPlayer: z.number(),
	board: z.array(z.array(z.number())).optional(),
	last: z.object({ x: z.number(), y: z.number() }).optional(),
});

export const gamePlayerSchema = userIdentitySchema.extend({
	localId: z.number().nullable(),
});

export const serverMessageSchema = z.discriminatedUnion("type", [
	z.object({ type: z.literal("system:registered"), data: z.string() }),
	z.object({ type: z.literal("system:error"), data: z.object({ message: z.string() }) }),
	z.object({ type: z.literal("game:p4:players"), data: z.array(gamePlayerSchema) }),
	z.object({ type: z.literal("game:p4:sync"), data: syncDataSchema }),
	z.object({ type: z.literal("game:p4:player-joined"), data: gamePlayerSchema }),
	z.object({
		type: z.literal("game:p4:matchmaking:matched"),
		data: z.object({ roomId: z.string(), playerId: z.number().nullable() }),
	}),
	z.object({
		type: z.literal("game:p4:play"),
		data: z.object({ playerId: z.number(), x: z.number(), y: z.number(), nextPlayerId: z.number() }),
	}),
	z.object({ type: z.literal("game:p4:draw"), data: z.undefined().optional() }),
	z.object({ type: z.literal("game:p4:win"), data: z.object({ uuid: z.string(), playerid: z.number() }) }),
	z.object({ type: z.literal("chat:info"), data: z.string() }),
	z.object({ type: z.literal("chat:vote"), data: z.object({ text: z.string(), command: z.string() }) }),
	z.object({
		type: z.literal("chat:message"),
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

export type ServerMessage = z.infer<typeof serverMessageSchema>;

export type JoinAck = z.infer<typeof joinAckSchema>;
export type MessageAck = z.infer<typeof messageAckSchema>;

export type SyncData = z.infer<typeof syncDataSchema>;
export type GamePlayer = z.infer<typeof gamePlayerSchema>;

export type ServerMessageData<T extends ServerMessage["type"]> =
	Extract<ServerMessage, { type: T }> extends { data?: infer D } ? D : never;

/** Ack attendu par le client pour chaque événement qui en fournit un ; `ClientToServerEvents` en dérive ses callbacks */
export interface ClientAckByEvent {
	"game:p4:join": JoinAck;
	"chat:message": MessageAck;
}

/**
 * Maps d'événements Socket.IO partagées entre l'api et le web :
 * - api : `Server<ClientToServerEvents, ServerToClientEvents, ...>`
 * - web : `Socket<ServerToClientEvents, ClientToServerEvents>`
 * Les types côté serveur décrivent des données non fiables : chaque payload
 * entrant est validé par le schéma zod correspondant avant d'atteindre un handler.
 */
export interface ClientToServerEvents {
	"game:p4:join": (
		roomId: z.infer<typeof roomIdSchema>,
		callback?: (ack: ClientAckByEvent["game:p4:join"]) => void,
	) => void;
	"game:p4:play": (x: z.infer<typeof playPayloadSchema>) => void;
	"game:p4:restart": () => void;
	"game:p4:leave": () => void;
	"game:p4:matchmaking:join": () => void;
	"game:p4:matchmaking:leave": () => void;
	"chat:message": (
		text: z.infer<typeof chatMessagePayloadSchema>,
		callback?: (ack: ClientAckByEvent["chat:message"]) => void,
	) => void;
}

export type ServerToClientEvents = {
	[T in ServerMessage["type"]]: (data: ServerMessageData<T>) => void;
};
