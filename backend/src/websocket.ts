import game from "./services/game.js";
import { P4 } from "./game/P4.js";
import { Player, RoomManager } from "./game/room/index.js";
import { getUserIdentifier } from "./lib/auth-utils.js";

export const rooms = new RoomManager(2, P4);
const regType = /^[a-z]+$/i;

type syncObject = { playerId: number | null; cPlayer: number; board?: number[][]; last?: { x: number; y: number } };
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

export const websocketConnection = async (socket: import("socket.io").Socket, req: any) => {
	const userIdentifier = getUserIdentifier(req);
	const player = new Player<typeof P4>(socket, userIdentifier);
	player.send({ type: "registered", data: player.uuid });

	// Socket.IO gère les événements directement - écouter les événements de jeu
	socket.on("join", async (roomId: string) => {
		if (!/[\w0-9]+/.test(roomId) || player.room?.id == roomId) return;
		try {
			rooms.join(roomId, player);
			player.send({ type: "joined", data: { roomId: player.room!.id, playerId: player.localId } });
			player.send({ type: "sync", data: getSyncData(player) });
		} catch (error) {
			if (error instanceof Error) {
				console.warn(`${player.uuid} : ${error.message}`);
				player.send({ type: "info", data: `Impossible de rejoindre la Salle #${roomId}, ${error.message}` });
				player.send({ type: "vote", data: { text: "Passer en mode spectateur ?", command: `/spect ${roomId}` } });
			}
			return;
		}
	});
	socket.on("play", async (x: number) => {
		if (player.localId === null || player.room === null) return;

		if (player.room.game.win || player.room.game.full || player.localId != player.room.game.cPlayer) return;
		const y = player.room.game.play(player.localId, x);
		if (y >= 0) {
			player.room.send({ type: "play", data: { playerId: player.localId, x, y, nextPlayerId: player.room.game.cPlayer } });
			if (player.room.game.check(x, y) || player.room.game.full) {
				const p1 = player.room.registeredPlayerList.find((e) => e.playerId == 1)!;
				const p2 = player.room.registeredPlayerList.find((e) => e.playerId == 2)!;
				try {
					await game.save(p1.uuid, p2.uuid, player.room.game.win, JSON.stringify(player.room.game.board));
				} catch (error) {
					console.error(`Failed to save game result for room ${player.room.id}:`, error);
					// Continue execution - game state is already updated, just logging the save failure
				}
				if (player.room.game.full) {
					player.room.send({ type: "game-full" });
				} else {
					player.room.send({ type: "game-win", data: { uuid: player.uuid, playerid: player.localId } });
				}
			}
		}
	});
	socket.on("restart", async (data?: { forced?: boolean }) => {
		if (player.room === null || typeof data === "string") {
			return;
		}
		if (player.room.game.win || player.room.game.full || data?.forced) {
			player.room.game.setDefault();
			player.room.send({ type: "restart" });
			player.room.send({ type: "sync", data: getSyncData(player) });
		} else {
			// Vote restart
		}
	});
	const commandList: { [key: string]: CallableFunction } = {
		help: async () => player.send({ type: "info", data: Object.keys(commandList) }),
		join: async (roomId: string) => socket.emit("join", roomId),
		swap: async () => {
			if (!player.room || !player.localId) {
				return;
			}
			// TODO: Implement swap functionality with proper data storage
			const other = player.room.playerList.find((p) => p.uuid != player.uuid);
			if (other) {
				// Simple swap implementation
				const tempId = player.localId;
				player.localId = other.localId;
				other.localId = tempId;
				const reg = player.room.registeredPlayerList;
				reg.forEach((e) => {
					e.playerId = e.playerId == 1 ? 2 : 1;
				});

				socket.emit("restart", { forced: true });
			}
		},
		spect: async (roomId: string) => {
			const room = rooms.get(roomId);
			if (room) {
				// TODO: Implement spect functionality
				player.send({ type: "info", data: "Spectator mode not yet implemented" });
			}
		},
		restart: async () => socket.emit("restart"),
		debug: async () => {
			// Debug command - output removed
		},
	};
	const unknownHandler = async () => player.send({ type: "info", data: "Commande inconnue" });
	socket.on("message", async (data: string) => {
		const text = (data ?? "").toString().trim();
		if (!text.match(/^\/\w+/)) {
			if (text.length > 0 && player.localId !== null) player.room?.send({ type: "message", data: { clientId: player.uuid, message: text } });
		} else {
			const match = text.match(/^\/(\w+)(?:\s+(\w+))?/);
			const command = match ? match[1] : "";
			const args = match ? match[2] : "";

			const cb: CallableFunction = commandList[command] ?? unknownHandler;
			const argsArray: string[] = (args ?? "").split(/\s+/).filter((e: string) => e);
			cb(...argsArray);
		}
	});
};
