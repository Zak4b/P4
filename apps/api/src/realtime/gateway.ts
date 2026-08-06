import { P4 } from "../game-engine/p4.js";
import { Player, RoomManager } from "../game-engine/index.js";
import type { AuthenticatedSocket } from "./socket-auth.js";
import { userRoom } from "./socket-rooms.js";
import { socketBroadcaster } from "./socket-broadcaster.js";
import { GameHistoryService } from "../modules/match/game-history.service.js";
import { logger } from "../lib/logger.js";

type syncObject = { playerId: number | null; cPlayer: number; board?: number[][]; last?: { x: number; y: number } };
type JoinResponse = { success: boolean; roomId?: string; playerId?: number; error?: string };

function getSyncData(player: Player<typeof P4>): syncObject {
	const game = player.room?.game;
	if (!game) {
		throw new Error("");
	}
	const syncData: syncObject = { playerId: player.localId, cPlayer: game.cPlayer };
	if (game.playCount) {
		syncData.board = game.board;
		syncData.last = game.last;
	}
	return syncData;
}

export function notifyPlayerJoinedRoom(player: Player<typeof P4>): void {
	const playersData = player.room!.playerList.map((p) => ({
		localId: p.localId!,
		name: p.displayName,
	}));
	player.send({ type: "players", data: playersData });
	player.send({ type: "sync", data: getSyncData(player) });
	player.room!.playerList.forEach((p) => {
		if (p.uuid !== player.uuid) {
			p.send({
				type: "player-joined",
				data: { localId: player.localId!, name: player.displayName },
			});
		}
	});
}

export const manager = new RoomManager(2, P4, socketBroadcaster, notifyPlayerJoinedRoom);

// Le moteur de jeu ne connaît ni Prisma ni Socket.IO : c'est ici, dans la couche
// applicative temps réel, qu'on persiste le résultat et qu'on notifie les joueurs.
manager.on("game-end", ({ room, winner, registeredPlayers, duration, board }) => {
	// Une erreur de persistance ne doit jamais faire tomber le process : sans ce
	// catch, la rejection remonte en unhandledRejection et Node coupe le serveur.
	GameHistoryService.save(registeredPlayers, winner, duration, board).catch((error: unknown) => {
		logger.error({ err: error, roomId: room.id }, "Failed to save game history");
	});
	if (winner === 0) {
		void room.send({ type: "game-draw" });
	} else {
		const player = registeredPlayers.find((p) => p.playerId === winner);
		if (player) {
			void room.send({ type: "game-win", data: { uuid: player.uuid, playerid: winner } });
		}
	}
});

export const websocketConnection = (socket: AuthenticatedSocket): void => {
	// Posé par le middleware d'auth dans bootstrap/plugins/socket-io.plugin.ts avant que "connection" ne se déclenche
	const { user } = socket.data;
	if (!user) {
		// Défense en profondeur : ne devrait jamais arriver, le middleware garantit l'auth
		socket.disconnect(true);
		return;
	}
	const player = new Player<typeof P4>(socket, user.id, user.login);
	void socket.join(userRoom(player.uuid));
	player.send({ type: "registered", data: player.uuid });

	socket.on("leave", () => {
		manager.leave(player);
	});

	socket.on("matchmaking-join", () => {
		console.log("[matchmaking] socket event: matchmaking-join", { uuid: player.uuid, displayName: player.displayName });
		manager.joinMatchmaking(player);
	});

	socket.on("matchmaking-leave", () => {
		console.log("[matchmaking] socket event: matchmaking-leave", {
			uuid: player.uuid,
			displayName: player.displayName,
		});
		manager.leaveMatchmaking(player);
	});

	socket.on("join", async (roomId: string, callback?: (response: JoinResponse) => void) => {
		try {
			if (!/[\w0-9]+/.test(roomId)) {
				throw new Error("Invalid room ID format");
			}
			manager.join(roomId, player);

			callback?.({
				success: true,
				roomId: player.room!.id,
				playerId: player.localId ?? undefined,
			});
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Failed to join room";
			const errorResponse: JoinResponse = {
				success: false,
				error: errorMessage,
			};
			player.send({ type: "info", data: `Impossible de rejoindre la Salle #${roomId}, ${errorMessage}` });
			player.send({ type: "vote", data: { text: "Passer en mode spectateur ?", command: `/spect ${roomId}` } });
			callback?.({ success: false, error: errorMessage });
		}
	});

	socket.on("play", async (x: number) => {
		if (player.localId === null || player.room === null) return;
		const { game } = player.room;

		try {
			const { y } = await game.play(player.localId, x);
			await player.room.send({
				type: "play",
				data: { playerId: player.localId, x, y, nextPlayerId: player.room.game.cPlayer },
			});
			if (!game.isEnded) {
				return;
			}
		} catch (error) {
			// TODO error
		}
	});
	socket.on("restart", async () => {
		if (player.room === null || player.localId === null) {
			return;
		}
		if (player.room.game.isEnded) {
			player.room.game.reset();
			// Envoyer un sync individuel à chaque joueur avec son propre playerId
			player.room.playerList.forEach((p) => {
				p.send({ type: "sync", data: getSyncData(p) });
			});
		} else {
			// Vote restart
		}
	});
	const commandList: { [key: string]: CallableFunction } = {
		help: async () => player.send({ type: "info", data: Object.keys(commandList).join(", ") }),
		join: async (roomId: string) => socket.emit("join", roomId),
		swap: async () => {
			if (!player.room || !player.localId) {
				return;
			}
			const other = player.room.playerList.find((p) => p.uuid != player.uuid);
			if (!other || other.localId === null) {
				return;
			}
			player.room.swapPlayerSlots(player, other);
			player.room.playerList.forEach((p) => {
				p.send({ type: "sync", data: getSyncData(p) });
			});
		},
		spect: async (roomId: string) => {
			const room = manager.get(roomId);
			if (room) {
				player.send({ type: "info", data: "Spectator mode not yet implemented" });
			}
		},
		debug: async () => {
			// Debug command - output removed
		},
	};
	const unknownHandler = async () => player.send({ type: "info", data: "Commande inconnue" });
	socket.on("message", async (data: string, callback?: (response: { success: boolean; message?: string }) => void) => {
		const text = (data ?? "").toString().trim();

		if (text.length === 0) {
			callback?.({ success: false });
			return;
		}

		if (!text.startsWith("/")) {
			if (!player.room || player.localId === null) {
				const errorMsg = "Vous devez être dans une partie pour envoyer des messages";
				player.send({ type: "info", data: errorMsg });
				callback?.({ success: false, message: errorMsg });
				return;
			}

			try {
				player.room.send({
					type: "message",
					data: { clientId: player.uuid, displayName: player.displayName, message: text },
				});
				callback?.({ success: true });
			} catch (error) {
				const errorMsg = error instanceof Error ? error.message : "Erreur lors de l'envoi du message";
				callback?.({ success: false, message: errorMsg });
			}
		} else {
			const match = text.match(/^\/(\w+)(?:\s+(\w+))?/);
			const command = match?.[1] ?? "";
			const args = match?.[2] ?? "";

			const cb: CallableFunction = commandList[command] ?? unknownHandler;
			const argsArray: string[] = (args ?? "").split(/\s+/).filter((e: string) => e);

			try {
				await cb(...argsArray);
				callback?.({ success: true });
			} catch (error) {
				const errorMsg = error instanceof Error ? error.message : "Erreur lors de l'exécution de la commande";
				callback?.({ success: false, message: errorMsg });
			}
		}
	});
};
