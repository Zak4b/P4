import type { ServerMessage } from "@p4/schemas/realtime";

export interface Message {
	type: string;
}

export interface RoomBroadcaster {
	toRoom(roomId: string, message: ServerMessage): void;
	toUser(userId: string, message: ServerMessage): void;
	broadcast(message: ServerMessage): void;
	/** Force tous les sockets d'une room à la quitter (nettoyage à la fermeture) */
	evictRoom(roomId: string): void;
}
