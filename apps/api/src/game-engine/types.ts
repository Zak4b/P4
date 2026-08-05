import type { serverMessageSchema } from "../lib/zod-schemas.js";
import type { z } from "zod";

export interface Message {
	type: string;
}

/** Cf. `serverMessageSchema` dans `lib/zod-schemas.ts` : source de vérité du shape des messages. */
export type ServerMessage = z.infer<typeof serverMessageSchema>;

export interface RoomBroadcaster {
	toRoom(roomId: string, message: ServerMessage): void;
	toUser(userId: string, message: ServerMessage): void;
	broadcast(message: ServerMessage): void;
	/** Force tous les sockets d'une room à la quitter (nettoyage à la fermeture) */
	evictRoom(roomId: string): void;
}
