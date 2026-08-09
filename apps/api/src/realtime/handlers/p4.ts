import { P4 } from "../../game-engine/p4.js";
import { Player, RoomManager } from "../../game-engine/index.js";
import type { Room } from "../../game-engine/index.js";
import type { GameEndPayload } from "../../game-engine/room.js";
import type { AuthenticatedSocket } from "../socket-auth.js";
import { socketBroadcaster } from "../socket-broadcaster.js";
import { onValidated } from "../validate.js";
import { GameHistoryService } from "../../modules/match/game-history.service.js";
import { logger } from "../../lib/logger.js";
import { playPayloadSchema, roomIdSchema, type GamePlayer, type JoinAck, type SyncData } from "@p4/schemas/realtime";

export function getSyncData(player: Player<typeof P4>): SyncData {
	const game = player.room?.game;
	if (!game) {
		throw new Error("");
	}
	const syncData: SyncData = { playerId: player.localId, cPlayer: game.cPlayer };
	if (game.playCount) {
		syncData.board = game.board;
		syncData.last = game.last;
	}
	return syncData;
}

/** Payload émis par le RoomManager sur "game-end" (le type interne n'est pas exporté) */
type GameEndEvent = GameEndPayload & { room: Room<typeof P4> };

function toGamePlayer(player: Player<typeof P4>): GamePlayer {
	return { id: player.uuid, login: player.displayName, localId: player.localId };
}

/** Envoie un `sync` individuel à chaque joueur de la salle : le playerId diffère d'un joueur à l'autre */
export async function syncRoom(player: Player<typeof P4>): Promise<void> {
	const playerList = player.room?.playerList ?? [];
	await Promise.all(playerList.map((p) => p.send({ type: "sync", data: getSyncData(p) })));
}

export async function notifyPlayerJoinedRoom(player: Player<typeof P4>): Promise<void> {
	const playerList = player.room?.playerList ?? [];
	await player.send({ type: "players", data: playerList.map(toGamePlayer) });
	await player.send({ type: "sync", data: getSyncData(player) });
	await Promise.all(
		playerList.map((p) => {
			if (p.uuid !== player.uuid) {
				return p.send({ type: "player-joined", data: toGamePlayer(player) });
			}
			return Promise.resolve();
		}),
	);
}

export const manager = new RoomManager(2, P4, socketBroadcaster, notifyPlayerJoinedRoom);

async function handleGameEnd({ room, winner, registeredPlayers, duration, board }: GameEndEvent): Promise<void> {
	await GameHistoryService.save(registeredPlayers, winner, duration, board).catch((error: unknown) => {
		logger.error({ err: error, roomId: room.id }, "Failed to save game history");
	});
	if (winner === 0) {
		await room.send({ type: "game-draw" });
	} else {
		const player = registeredPlayers.find((p) => p.playerId === winner);
		if (player) {
			await room.send({ type: "game-win", data: { uuid: player.uuid, playerid: winner } });
		}
	}
}

manager.on("game-end", (payload) => {
	handleGameEnd(payload).catch((error: unknown) => {
		logger.error({ err: error, roomId: payload.room.id }, "Failed to handle game end");
	});
});

/**
 * Flux de jonction commun à l'événement `join` et à la commande chat `/join` :
 * messagerie d'échec (info + proposition de mode spectateur) et ack typé.
 */
export async function joinRoom(player: Player<typeof P4>, roomId: string): Promise<JoinAck> {
	try {
		await manager.join(roomId, player);
		return {
			success: true,
			roomId: player.room!.id,
			playerId: player.localId ?? undefined,
		};
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "Failed to join room";
		await player.send({ type: "info", data: `Impossible de rejoindre la Salle #${roomId}, ${errorMessage}` });
		await player.send({ type: "vote", data: { text: "Passer en mode spectateur ?", command: `/spect ${roomId}` } });
		return { success: false, error: errorMessage };
	}
}

/** Événements de salle et de partie : join / leave / play / restart */
export function registerP4Handlers(socket: AuthenticatedSocket, player: Player<typeof P4>): void {
	socket.on("leave", () => {
		manager.leave(player);
	});

	onValidated(
		socket,
		"join",
		roomIdSchema,
		async (roomId, callback) => {
			callback?.(await joinRoom(player, roomId));
		},
		{ success: false, error: "Invalid payload" },
	);

	onValidated(socket, "play", playPayloadSchema, async (x) => {
		if (player.localId === null || player.room === null) {
			return;
		}
		const { game } = player.room;

		try {
			const { y } = await game.play(player.localId, x);
			await player.room.send({
				type: "play",
				data: { playerId: player.localId, x, y, nextPlayerId: player.room.game.cPlayer },
			});
		} catch {
			// TODO error
		}
	});

	socket.on("restart", async () => {
		if (player.room === null || player.localId === null) {
			return;
		}
		if (player.room.game.isEnded) {
			player.room.game.reset();
			await syncRoom(player);
		} else {
			// Vote restart
		}
	});
}
