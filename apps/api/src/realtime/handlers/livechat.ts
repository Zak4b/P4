import type { P4 } from "../../game-engine/p4.js";
import type { Player } from "../../game-engine/index.js";
import type { AuthenticatedSocket } from "../socket-auth.js";
import { chatMessagePayloadSchema, roomIdSchema, type MessageAck } from "@p4/schemas/realtime";
import { onValidated } from "../validate.js";
import { joinRoom, manager, syncRoom } from "./p4.js";

type Command = (...args: string[]) => void | Promise<void>;

/** Commandes texte `/xxx` disponibles depuis le chat */
function buildCommandList(player: Player<typeof P4>): Record<string, Command> {
	const commandList: Record<string, Command> = {
		help: async () => {
			await player.send({ type: "chat:info", data: Object.keys(commandList).join(", ") });
		},
		join: async (roomId: string) => {
			const parsed = roomIdSchema.safeParse(roomId);
			if (!parsed.success) {
				await player.send({ type: "chat:info", data: "Identifiant de salle invalide" });
				return;
			}
			await joinRoom(player, parsed.data);
		},
		swap: async () => {
			if (!player.room || !player.localId) {
				return;
			}
			const other = player.room.playerList.find((p) => p.uuid !== player.uuid);
			if (!other) {
				return;
			}
			if (other.localId === null) {
				return;
			}
			player.room.swapPlayerSlots(player, other);
			await syncRoom(player);
		},
		spect: async (roomId: string) => {
			const room = manager.get(roomId);
			if (room) {
				await player.send({ type: "chat:info", data: "Spectator mode not yet implemented" });
			}
		},
		debug: () => {
			// Debug command - output removed
		},
	};
	return commandList;
}

/** Message libre : diffusé à toute la salle, à condition d'être dans une partie */
async function handleChatMessage(player: Player<typeof P4>, text: string): Promise<MessageAck> {
	if (!player.room || player.localId === null) {
		const errorMsg = "Vous devez être dans une partie pour envoyer des messages";
		await player.send({ type: "chat:info", data: errorMsg });
		return { success: false, message: errorMsg };
	}

	try {
		await player.room.send({
			type: "chat:message",
			data: { clientId: player.uuid, displayName: player.displayName, message: text },
		});
		return { success: true };
	} catch (error) {
		const errorMsg = error instanceof Error ? error.message : "Erreur lors de l'envoi du message";
		return { success: false, message: errorMsg };
	}
}

/** Texte commençant par `/` : dispatch vers la commande correspondante */
async function handleCommand(
	player: Player<typeof P4>,
	commandList: Record<string, Command>,
	text: string,
): Promise<MessageAck> {
	const match = /^\/(\w+)(?:\s+(\w+))?/.exec(text);
	const command = match?.[1] ?? "";
	const args = match?.[2] ?? "";

	const cb: Command =
		commandList[command] ??
		(async () => {
			await player.send({ type: "chat:info", data: "Commande inconnue" });
		});
	const argsArray: string[] = args.split(/\s+/).filter((e: string) => e);

	try {
		await cb(...argsArray);
		return { success: true };
	} catch (error) {
		const errorMsg = error instanceof Error ? error.message : "Erreur lors de l'exécution de la commande";
		return { success: false, message: errorMsg };
	}
}

/** Chat de salle : messages libres et commandes */
export function registerLivechatHandlers(socket: AuthenticatedSocket, player: Player<typeof P4>): void {
	const commandList = buildCommandList(player);

	// Le schéma garantit un texte non vide (trim + min 1) et borné en longueur
	onValidated(
		socket,
		"chat:message",
		chatMessagePayloadSchema,
		async (text, callback) => {
			const ack = text.startsWith("/")
				? await handleCommand(player, commandList, text)
				: await handleChatMessage(player, text);
			callback?.(ack);
		},
		{ success: false, message: "Invalid payload" },
	);
}
