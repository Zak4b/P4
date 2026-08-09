import type { z } from "zod";
import type { ClientAckByEvent, ClientToServerEvents } from "@p4/schemas/realtime";
import type { AuthenticatedSocket } from "./socket-auth.js";
import { emitServerMessage } from "./socket-emit.js";
import { logger } from "../lib/logger.js";

type AckFor<E extends keyof ClientToServerEvents> = E extends keyof ClientAckByEvent ? ClientAckByEvent[E] : never;

/**
 * Enregistre un handler d'événement client -> serveur en validant le payload avec zod
 * avant qu'il n'atteigne le handler : les types de `ClientToServerEvents` décrivent des
 * données non fiables, seul ce point d'entrée les rend sûres côté serveur.
 * La contrainte sur `S` garantit que le schéma produit bien le type de payload déclaré
 * par l'événement dans `ClientToServerEvents`.
 *
 * En cas de payload invalide : log, message `error` au client, et ack d'échec si
 * l'événement en attend un (`invalidAck`).
 */
export function onValidated<
	E extends keyof ClientToServerEvents,
	S extends z.ZodType<Parameters<ClientToServerEvents[E]>[0]>,
>(
	socket: AuthenticatedSocket,
	event: E,
	schema: S,
	handler: (data: z.output<S>, ack?: (response: AckFor<E>) => void) => void | Promise<void>,
	invalidAck?: AckFor<E>,
): void {
	const listener = (...args: unknown[]): void => {
		const last = args[args.length - 1];
		const ack = typeof last === "function" ? (last as (response: AckFor<E>) => void) : undefined;
		const payload = ack && args.length === 1 ? undefined : args[0];

		const parsed = schema.safeParse(payload);
		if (!parsed.success) {
			logger.warn({ event, userId: socket.data.user.id, issues: parsed.error.issues }, "Invalid realtime payload");
			emitServerMessage(socket, { type: "system:error", data: { message: `Invalid payload for "${event}"` } });
			if (ack && invalidAck) {
				ack(invalidAck);
			}
			return;
		}

		Promise.resolve(handler(parsed.data, ack)).catch((error: unknown) => {
			logger.error({ err: error, event, userId: socket.data.user.id }, "Realtime handler failed");
		});
	};

	// Cast requis : `socket.on` ne peut pas réduire son type conditionnel avec un nom d'événement générique
	socket.on(event, listener as never);
}
