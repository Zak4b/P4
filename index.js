require("dotenv").config();
const http = require("http");
const WebSocket = require("ws");
const P4 = require("./P4.js");
const { Player, GameRoomList } = require("./gameRoom.js");
const { createReadStream } = require("node:fs");

const server = http.createServer(async (req, res) => {
	const url = new URL(req.url, `http://${req.headers.host}`);
	//console.log("req.url", req.url, `http://${req.headers.host}`, url.pathname);

	const stream = createReadStream("./ahh.html");
	stream.pipe(res);
});

server.listen(process.env.PORT, process.env.IP, () => {
	console.log(`Server running`);
});

const rooms = new GameRoomList(2, P4);
const wss = new WebSocket.Server({ noServer: true });

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
		switch (action) {
			case "join":
				try {
					rooms.join(data, player);
				} catch (error) {
					console.warn(`${player.uuid} : Salle #${data} pleine`);
					return;
				}
				player.send("joined", { roomid: player.room.id, playerId: player.playerId });
				player.send("sync", { board: player.room.game.board, cPlayer: player.room.game.cPlayer });
				break;
			case "play":
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
				break;
			case "restart":
				player.room.game.setDefault();
				player.room.send("restart");
				break;
			case "message":
				typeof data === "string" && data && player.room.send("message", { clientId: player.uuid, message: data });
				break;
			case "debug":
				console.log(rooms);
				console.log(player);
			default:
				break;
		}
	});
});
// Associez le serveur WebSocket au serveur HTTP
server.on("upgrade", (request, socket, head) => {
	wss.handleUpgrade(request, socket, head, (ws) => {
		wss.emit("connection", ws, request);
	});
});
