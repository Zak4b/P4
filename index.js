require("dotenv").config();
const http = require("http");
const WebSocket = require("ws");
const P4 = require("./P4.js");
const { createReadStream } = require("node:fs");
const uuid = require("uuid");

const server = http.createServer(async (req, res) => {
	const url = new URL(req.url, `http://${req.headers.host}`);
	//console.log("req.url", req.url, `http://${req.headers.host}`, url.pathname);

	const stream = createReadStream("./ahh.html");
	stream.pipe(res);
});

server.listen(process.env.PORT, process.env.IP, () => {
	console.log(`Server running`);
});

const clientList = new Map();
const rooms = {};
const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (socket) => {
	console.log("Nouvelle connexion WebSocket");
	const clientId = uuid.v4();
	clientList.set(clientId, { socket, room: null });
	sendMsg(socket, "registered", clientId);

	socket.on("message", (message) => {
		console.log(`${clientId} : `, message.toString());
		try {
			message = JSON.parse(message);
		} catch (error) {
			console.warn(`${clientId} Message invalide`);
			return;
		}
		const getRoomId = () => clientList.get(clientId)?.room;

		const { act: action, data } = message;
		const roomId = getRoomId();
		switch (action) {
			case "join":
				if (joinRoom(clientId, data)) {
					sendMsg(socket, "sync", rooms[getRoomId()].game.plateau);
				} else {
					console.warn(`${clientId} : Salle ${data} pleine`);
				}
				break;
			case "play":
				const game = rooms[roomId].game;
				const x = data;
				if (game.win) {
					game.setDefault();
					sendMsgRoom(roomId, "restart");
					return;
				}
				const playerId = rooms[roomId].players.indexOf(clientId) + 1;

				if (playerId != game.cPlayer) return;
				const y = game.play(playerId, x);
				if (y < 0) {
					console.log("Forbiden");
				} else {
					sendMsgRoom(roomId, "play", { playerId, x, y });
					if (game.check(x, y)) {
						sendMsgRoom(roomId, "game-end", 17);
					}
				}
				break;
			case "message":
				typeof data === "string" && data && sendMsgRoom(roomId, "message", { clientId, message: data });
				break;
			case "debug":
				console.log(rooms);
				console.log(clientList.get(clientId));
			default:
				break;
		}
	});

	function joinRoom(clientId, roomId) {
		if (rooms[roomId]) {
			if (rooms[roomId].length >= 2) return 0;
			rooms[roomId].players.push(clientId);
		} else {
			rooms[roomId] = { players: [clientId], game: new P4() };
		}
		clientList.get(clientId).room = roomId;
		return 1;
	}

	function sendMsg(socket, act, data) {
		socket.send(JSON.stringify({ act, data }));
	}
	function sendMsgRoom(id, act, data) {
		rooms[id].players.forEach((clientId) => {
			sendMsg(clientList.get(clientId).socket, act, data);
		});
	}

	socket.on("close", (code, reason) => {
		const roomId = clientList.get(clientId).room;
		rooms[roomId].players = rooms[roomId].players.filter((e) => e != clientId);
		if (rooms[roomId].players.length === 0) delete rooms[roomId];
		clientList.delete(clientId);
		console.log(`Connexion fermée avec le code : ${code}, raison : ${reason}`);
	});
});
// Associez le serveur WebSocket au serveur HTTP
server.on("upgrade", (request, socket, head) => {
	wss.handleUpgrade(request, socket, head, (ws) => {
		wss.emit("connection", ws, request);
	});
});
