import { Socket } from "socket.io";
import GameService from "./services/game.js";
import { P4 } from "./game/P4.js";
import { Player, RoomManager } from "./game/room/index.js";
import { getUserIdentifier, getUserId } from "./lib/auth-utils.js";

export const rooms = new RoomManager(2, P4);

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

export const websocketConnection = async (socket: Socket, req: any) => {
	try {
		const userIdentifier = getUserIdentifier(req);
		const userId = getUserId(req);
		const playerUuid = userId ?? userIdentifier;
		const player = new Player<typeof P4>(socket, playerUuid);
		player.send({ type: "registered", data: player.uuid });

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
		const {game} = player.room;

		try {
			const {y} = await game.play(player.localId, x);
			await player.room.send({ type: "play", data: { playerId: player.localId, x, y, nextPlayerId: player.room.game.cPlayer } });
			if (!game.isEnded) {
				return;
			}
			GameService.finalizeFromRoom(player.room.registeredPlayerList, game.winner ?? 0, game.board);
			if (game.winner === 0) {
				player.room.send({ type: "game-draw" });
			} else {
				player.room.send({ type: "game-win", data: { uuid: player.uuid, playerid: player.localId } });
			}
		} catch (error) {
			// TODO error
		}
	});
	socket.on("restart", async ({ forced = false }: { forced?: boolean }) => {
		if (player.room === null || player.localId === null) {
			return;
		}
		if (forced || player.room.game.isEnded) {
			player.room.game.reset();
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
	} catch (error) {
		socket.emit("error", "Authentication required");
		socket.disconnect(true);
		return;
	}
};
