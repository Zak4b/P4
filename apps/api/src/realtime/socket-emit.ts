import type { ServerMessage } from "@p4/schemas/realtime";

/**
 * Cible d'émission minimale (Socket ou BroadcastOperator). La sécurité de type
 * est portée par le paramètre `message: ServerMessage`, vérifié à la construction :
 * cette signature relâchée évite de devoir caster à chaque émission d'une union.
 */
interface ServerMessageTarget {
	emit(event: string, data?: unknown): unknown;
}

/** Point d'émission unique des messages serveur -> client : `event = message.type`, payload = `message.data` */
export function emitServerMessage(target: ServerMessageTarget, message: ServerMessage): void {
	target.emit(message.type, message.data);
}
