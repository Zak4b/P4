import { P4 } from "./class/P4.js";
import { Player, GameRoomList } from "./class/gameRoom.js";

export const rooms = new GameRoomList(2, P4);
const regType = /^[a-z]+$/i;

/**
 * @param {player} player
 * @returns {object}
 */
function getSyncData(player) {
	const syncData = { playerId: player.playerId, cPlayer: player.room.game.cPlayer };
	if (player.room.game.playCount) {
		syncData.board = player.room.game.board;
	}
	return syncData;
}
/**
 * @param {import('ws').WebSocket} socket
 * @param {import('express').Request} req
 */
export const websocketConnection = async (socket, req) => {
	let uuid = req.signedCookies.token?.uuid;
	const player = new Player(socket, uuid);
	console.log("Nouvelle connexion " + player.uuid);
	player.send("registered", player.uuid);

	socket.on("message", async (message) => {
		try {
			message = JSON.parse(message);
		} catch (error) {
			return;
		}
		const { type: type, data } = message;
		if (regType.test(String(type))) {
			console.log(`${player.uuid} : `, message);
			socket.emit(`game-${type}`, data);
		}
	});
	socket.on("game-join", async (data) => {
		if (!/[\w0-9]+/.test(data) || player?.room?.id == data) return;
		try {
			rooms.join(data, player);
		} catch (error) {
			console.warn(`${player.uuid} : ${error.message}`);
			player.send("info", `Impossible de rejoindre la Salle #${data}, salle pleine`);
			player.send("vote", { text: "Passer en mode spectateur ?", command: `/spect ${data}` });
			return;
		}
		player.send("joined", { roomId: player.room.id, playerId: player.playerId });
		player.send("sync", getSyncData(player));
	});
	socket.on("game-play", async (data) => {
		if (player.playerId === null) return;
		let x;
		try {
			x = parseInt(data, 10);
		} catch (error) {
			console.error("x number");
			return;
		}
		if (player.room.game.win || player.room.game.full || player.playerId != player.room.game.cPlayer) return;
		const y = player.room.game.play(player.playerId, x);
		if (y < 0) {
			console.log("Forbiden");
		} else {
			player.room.send("play", { playerId: player.playerId, x, y, nextPlayerId: player.room.game.cPlayer });
			if (player.room.game.check(x, y)) {
				player.room.send("game-win", { uuid: player.uuid, playerid: player.playerId });
			} else if (player.room.game.full) {
				player.room.send("game-full");
			}
		}
	});
	socket.on("game-restart", async (data) => {
		if (player.room.game.win || player.room.game.full || data["forced"]) {
			player.room.game.setDefault();
			player.room.send("restart");
			player.room.send("sync", getSyncData(player));
		} else {
			// Vote restart
		}
	});
	const commandList = {
		help: async () => player.send("info", Object.keys(commandList)),
		join: async (roomId) => socket.emit("game-join", roomId),
		swap: async () => {
			player.data.set("swap", true);
			const other = player.room.playerList.filter((p) => p.uuid != player.uuid)[0];
			if (other.data.get("swap") === true) {
				const tmp = player.playerId;
				player.playerId = other.playerId;
				player.data.delete("swap");
				other.playerId = tmp;
				other.data.delete("swap");
				socket.emit("game-restart", { forced: true });
			} else {
				player.send("info", "Demande d'échange envoyé");
				other.send("vote", { text: "Echanger de couleur ?", command: "/swap" });
			}
		},
		spect: async (roomId) => {
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
	socket.on("game-message", async (data) => {
		const text = (data ?? "").toString().trim();
		if (!text.match(/^\/\w+/)) {
			if (text.length > 0 && player.playerId !== null) player.room.send("message", { clientId: player.uuid, message: text });
		} else {
			const match = text.match(/^\/(\w+)(?:\s+(\w+))?/);
			const { 1: command, 2: args } = match;
			/**@type {CallableFunction} */
			const cb = commandList[command] ?? unknownHandler;
			/**@type {string[]} */
			const argsArray = (args ?? "").split(/\s+/).filter((e) => e);
			cb(...argsArray);
		}
	});
};

async function onMessage(message) {
	try {
		message = JSON.parse(message);
	} catch (error) {
		return;
	}
	const { type: type, data } = message;
	if (regType.test(String(type))) {
		console.log(`${player.uuid} : `, message);
		socket.emit(`game-${type}`, data);
	}
}
