import game from "./actions/game.js";
import { P4 } from "./class/P4.js";
import { Player, GameRoomList } from "./class/gameRoom.js";

export const rooms = new GameRoomList(2, P4);
const regType = /^[a-z]+$/i;

type syncObject = { playerId: number | null; cPlayer: number; board?: number[][] };
function getSyncData(player: Player<typeof P4>): syncObject {
	const game = player.room?.game;
	if (!game) {
		throw new Error("");
	}
	const syncData: syncObject = { playerId: player.playerId, cPlayer: game.cPlayer };
	if (game.playCount) {
		syncData.board = game.board;
	}
	return syncData;
}

export const websocketConnection = async (socket: import("ws").WebSocket, req: import("express").Request) => {
	const uuid = req.signedCookies.token?.uuid;
	const player = new Player<typeof P4>(socket, uuid);
	console.log("Nouvelle connexion " + player.uuid);
	player.send("registered", player.uuid);

	socket.on("message", async (message) => {
		try {
			const messageObject = JSON.parse(message.toString());
			const { type, data } = messageObject;
			if (regType.test(String(type))) {
				socket.emit(`game-${type}`, data);
			}
		} catch (error) {
			return;
		}
	});
	socket.on("game-join", async (roomId: string) => {
		if (!/[\w0-9]+/.test(roomId) || player.room?.id == roomId) return;
		try {
			rooms.join(roomId, player);
			player.send("joined", { roomId: player.room!.id, playerId: player.playerId });
			player.send("sync", getSyncData(player));
		} catch (error) {
			if (error instanceof Error) {
				console.warn(`${player.uuid} : ${error.message}`);
				player.send("info", `Impossible de rejoindre la Salle #${roomId}, ${error.message}`);
				player.send("vote", { text: "Passer en mode spectateur ?", command: `/spect ${roomId}` });
			}
			return;
		}
	});
	socket.on("game-play", async (x: number) => {
		if (player.playerId === null || player.room === null) return;

		if (player.room.game.win || player.room.game.full || player.playerId != player.room.game.cPlayer) return;
		const y = player.room.game.play(player.playerId, x);
		if (y < 0) {
			console.log("Forbiden");
		} else {
			player.room.send("play", { playerId: player.playerId, x, y, nextPlayerId: player.room.game.cPlayer });
			if (player.room.game.check(x, y) || player.room.game.full) {
				const p1 = player.room.registeredPlayerList.find((e) => e.playerId == 1)!;
				const p2 = player.room.registeredPlayerList.find((e) => e.playerId == 2)!;
				game.save(p1.uuid, p2.uuid, player.room.game.win, JSON.stringify(player.room.game.board));
				if (player.room.game.full) {
					player.room.send("game-full");
				} else {
					player.room.send("game-win", { uuid: player.uuid, playerid: player.playerId });
				}
			}
		}
	});
	socket.on("game-restart", async (data?: { forced?: boolean }) => {
		if (player.room === null || typeof data === "string") {
			return;
		}
		if (player.room.game.win || player.room.game.full || data?.forced) {
			player.room.game.setDefault();
			player.room.send("restart");
			player.room.send("sync", getSyncData(player));
		} else {
			// Vote restart
		}
	});
	const commandList: { [key: string]: CallableFunction } = {
		help: async () => player.send("info", Object.keys(commandList)),
		join: async (roomId: string) => socket.emit("game-join", roomId),
		swap: async () => {
			if (!player.room || !player.playerId) {
				return;
			}
			player.data.set("swap", true);
			const other = player.room.playerList.find((p) => p.uuid != player.uuid);
			if (other) {
				if (other.data?.get("swap") === true) {
					player.data.delete("swap");
					other.data.delete("swap");
					player.playerId = other.playerId;
					other.playerId = other.playerId == 1 ? 2 : 1;
					const reg = player.room.registeredPlayerList;
					reg.forEach((e) => {
						e.playerId = e.playerId == 1 ? 2 : 1;
					});

					socket.emit("game-restart", { forced: true });
				} else {
					player.send("info", "Demande d'échange envoyé");
					other.send("vote", { text: "Echanger de couleur ?", command: "/swap" });
				}
			}
		},
		spect: async (roomId: string) => {
			const room = rooms.get(roomId);
			if (room) {
				room.spect(player);
				player.send("info");
				player.send("sync", getSyncData(player));
			}
		},
		restart: async () => socket.emit("game-restart"),
		debug: async () => {
			console.log(rooms);
			console.log(player);
		},
	};
	const unknownHandler = async () => player.send("info", "Commande inconnue");
	socket.on("game-message", async (data: string) => {
		const text = (data ?? "").toString().trim();
		if (!text.match(/^\/\w+/)) {
			if (text.length > 0 && player.playerId !== null) player.room?.send("message", { clientId: player.uuid, message: text });
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
