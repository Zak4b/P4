require("dotenv").config();
const http = require("http");
const WebSocket = require("ws");
const P4 = require("./P4.js");
const { Player, GameRoomList } = require("./gameRoom.js");
const { createReadStream } = require("node:fs");

const server = http.createServer(async (req, res) => {
	const url = new URL(req.url, `http://${req.headers.host}`);

	const stream = createReadStream("./ahh.html");
	stream.pipe(res);
});

server.listen(process.env.PORT, process.env.IP, () => {
	console.log(`Server running`);
});

const rooms = new GameRoomList(2, P4);
const wss = new WebSocket.Server({ noServer: true });
const regAct = /^[a-z]+$/i;

wss.on("connection", (socket) => {
	console.log("Nouvelle connexion WebSocket");
	const player = new Player(socket);
	player.send("registered", player.uuid);

	socket.on("message", (message) => {
		console.log(`${player.uuid} : `, message.toString());
		try {
			message = JSON.parse(message);
		} catch (error) {
			console.warn(`${clientId} Message invalide`);
			return;
		}
		const { act: action, data } = message;
		if (regAct.test(String(action))) socket.emit(`act-${action}`, data);
	});
	socket.on("act-join", (data) => {
		try {
			rooms.join(data, player);
		} catch (error) {
			console.warn(`${player.uuid} : Salle #${data} pleine`);
			return;
		}
		player.send("joined", { roomid: player.room.id, playerId: player.playerId });
		player.send("sync", { board: player.room.game.board, cPlayer: player.room.game.cPlayer });
	});
	socket.on("act-play", (data) => {
		const x = data;
		if (player.room.game.win) {
			return;
		}
		if (player.playerId != player.room.game.cPlayer) return;
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
	socket.on("act-restart", (data) => {
		player.room.game.setDefault();
		player.room.send("restart");
	});
	socket.on("act-message", (data) => {
		const text = data.trim();
		if (text[0] != "/") {
			if (text[0]) data && player.room.send("message", { clientId: player.uuid, message: text });
		} else {
			const command = text.slice(1);
			switch (command) {
				case "pute":
					player.room.send(command);
					break;

				default:
					break;
			}
		}
	});
	socket.on("act-debug", (data) => {
		console.log(rooms);
		console.log(player);
	});
});
// Associez le serveur WebSocket au serveur HTTP
server.on("upgrade", (request, socket, head) => {
	wss.handleUpgrade(request, socket, head, (ws) => {
		wss.emit("connection", ws, request);
	});
});
