import { WebSocketServer } from "ws";
import { P4 } from "./P4.js";
import { Player, GameRoomList } from "./gameRoom.js";

export const wss = new WebSocketServer({ noServer: true });
export const rooms = new GameRoomList(2, P4);
const regAct = /^[a-z]+$/i;

wss.on("connection", async (socket) => {
	const player = new Player(socket);
	console.log("Nouvelle connexion " + player.uuid);
	player.send("registered", player.uuid);

	socket.on("message", async (message) => {
		//console.log(`${player.uuid} : `, message.toString());
		try {
			message = JSON.parse(message);
		} catch (error) {
			console.warn(`${clientId} Message invalide`);
			return;
		}
		const { act: action, data } = message;
		if (regAct.test(String(action))) socket.emit(`act-${action}`, data);
	});
	socket.on("act-join", async (data) => {
		try {
			rooms.join(data, player);
		} catch (error) {
			console.warn(`${player.uuid} : ${error.message}`);
			player.send("info", `Impossible de rejoindre la Salle #${data}, salle pleine`);
			return;
		}
		player.send("joined", { roomId: player.room.id, playerId: player.playerId });
		const syncData = { cPlayer: player.room.game.cPlayer };
		if (player.room.game.playCount) syncData.board = player.room.game.board;
		player.send("sync", syncData);
	});
	socket.on("act-play", async (data) => {
		const x = data;
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
	socket.on("act-restart", async () => {
		if (player.room.game.win | player.room.game.full) {
			player.room.game.setDefault();
			player.room.send("restart");
			player.room.send("sync", { cPlayer: player.room.game.cPlayer });
		} else {
			// Vote restart
		}
	});
	const commandList = {
		join: async (data) => socket.emit("act-join", data),
		xcx: async () => {},
		restart: async () => {
			socket.emit("act-restart");
		},
		debug: async () => {
			console.log(rooms);
			console.log(player);
		},
	};
	const unknownHandler = async () => player.send("info", "Commande inconnue");
	socket.on("act-message", async (data) => {
		const text = data.trim();
		if (!text.match(/^\/\w+/)) {
			player.room.send("message", { clientId: player.uuid, message: text });
		} else {
			const match = text.match(/^\/(\w+)(?:\s+(\w+))?/);
			const { 1: command, 2: args } = match;
			const cb = commandList[command] ?? unknownHandler;
			cb(...(args ?? "").split(/\s+/));
		}
	});
});
