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
				try {
					const newPlayerId = joinRoom(clientId, data);
					sendMsg(socket, "joined", { roomid: getRoomId(), playerId: newPlayerId });
					sendMsg(socket, "sync", { board: rooms[getRoomId()].game.board, cPlayer: rooms[getRoomId()].game.cPlayer });
				} catch (error) {
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
				const playerId = rooms[roomId].players.find((e) => e.uuid == clientId).playerId;
				console.log("PlayerID", playerId);
				if (playerId != game.cPlayer) return;
				const y = game.play(playerId, x);
				if (y < 0) {
					console.log("Forbiden");
				} else {
					sendMsgRoom(roomId, "play", { playerId, x, y, nextPlayerId: game.cPlayer });
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
		let playerId;
		if (clientList.get(clientId)?.room) throw new Error("Déjà dans une room");
		if (rooms[roomId]) {
			if (rooms[roomId].players.length >= 2) throw new Error("Room pleine");
			playerId = rooms[roomId].players[0].playerId == 1 ? 2 : 1;
		} else {
			playerId = 1;
			rooms[roomId] = { players: [], game: new P4() };
		}
		rooms[roomId].players.push({ uuid: clientId, playerId: playerId });
		clientList.get(clientId).room = roomId;
		return playerId;
	}

	function sendMsg(socket, act, data) {
		socket.send(JSON.stringify({ act, data }));
	}
	function sendMsgRoom(id, act, data) {
		rooms[id].players.forEach((client) => {
			sendMsg(clientList.get(client.uuid).socket, act, data);
		});
	}

	socket.on("close", (code, reason) => {
		const roomId = clientList.get(clientId).room;
		rooms[roomId].players = rooms[roomId].players.filter((e) => e.uuid != clientId);
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
