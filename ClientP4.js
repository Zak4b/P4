class ClientP4 extends EventTarget {
	#uuid = null;
	#roomId = null;
	#playerId = null;
	socket;
	/**
	 * @param {WebSocket} socket
	 */
	constructor(socket) {
		super();
		this.socket = socket;
		this.socket.addEventListener("open", (event) => {
			console.log("Connexion établie avec le serveur Websocket");
			this.socket.send(JSON.stringify({ act: "join", data: 15 }));
		});
		this.socket.addEventListener("message", this.messageHandler.bind(this));
		this.socket.addEventListener("close", () => {
			console.log(">>> Connexion Websocket fermée");
		});
		this.socket.addEventListener("act-registered", this.onRegistered.bind(this));
		this.socket.addEventListener("act-joined", this.onJoin.bind(this));
		this.socket.addEventListener("act-play", ({ detail: data }) => this.emit("play", data));
		this.socket.addEventListener("act-game-win", ({ detail: data }) => this.emit("win", data));
		this.socket.addEventListener("act-game-full", () => this.emit("full"));
		this.socket.addEventListener("act-sync", ({ detail: data }) => this.emit("sync", data));
		this.socket.addEventListener("act-info", ({ detail: data }) => this.emit("info", data));
		this.socket.addEventListener("act-message", ({ detail: data }) => this.emit("message", data));
		this.socket.addEventListener("act-restart", () => this.emit("restart"));
	}
	get uuid() {
		return this.#uuid;
	}
	get roomId() {
		return this.#roomId;
	}
	get playerId() {
		return this.#playerId;
	}
	send(act, data) {
		this.socket.send(JSON.stringify({ act, data }));
	}
	message(text) {
		this.send("message", text);
	}
	play(x) {
		this.send("play", x);
	}
	/**
	 * @param {string} event
	 * @param {string | {}} data
	 */
	emit(event, data) {
		this.dispatchEvent(new CustomEvent(event, { detail: data }));
	}

	messageHandler(event) {
		let message;
		try {
			message = JSON.parse(event.data);
		} catch (error) {
			console.warn(`Message invalide`);
			return;
		}
		console.debug(message);
		const { act: action, data } = message;
		if (/^[a-z\-]+$/i.test(String(action))) this.socket.dispatchEvent(new CustomEvent(`act-${action}`, { detail: data }));
	}
	onRegistered({ detail: data }) {
		this.#uuid = data;
		this.emit("registered", this.#uuid);
	}
	onJoin({ detail: data }) {
		this.#roomId = data.roomId;
		this.#playerId = data.playerId;
		this.emit("join", data);
	}
}

class canvasInterface {
	#PlayerClrs = ["#000000", "#CE1D30", "#FDD334"];
	#canvas;
	#ctx;
	#taille_C = 110;
	#clickHandler;

	/**
	 * @param {*} canvas
	 */
	constructor(canvas, clickHandler) {
		this.#canvas = canvas;
		this.#canvas.width = this.width;
		this.#canvas.height = this.height;
		this.#ctx = this.#canvas.getContext("2d");
		this.initCanvas();
		this.#clickHandler = clickHandler;
		this.#canvas.addEventListener("click", (event) => {
			const { offsetX: i, offsetY: j } = event;
			const x = Math.floor(event.offsetX / this.#taille_C);
			console.debug(`Click (${i},${j}) -> c${x}`);
			this.#clickHandler(x);
		});
	}
	get width() {
		return 7 * this.#taille_C;
	}
	get height() {
		return 6 * this.#taille_C;
	}
	getColor(playerId) {
		return this.#PlayerClrs[playerId];
	}
	initCanvas() {
		this.#ctx.fillStyle = "#9c9c9c";
		this.#ctx.fillRect(0, 0, this.width, this.height);

		this.#ctx.strokeStyle = "#4444FF";
		this.#ctx.lineWidth = 5;
		for (let i = 0; i < 8; i++) {
			this.#ctx.beginPath();
			this.#ctx.moveTo(i * this.#taille_C, 0);
			this.#ctx.lineTo(i * this.#taille_C, this.height);
			this.#ctx.stroke();
		}
		for (let i = 0; i < 7; i++) {
			this.#ctx.beginPath();
			this.#ctx.moveTo(0, i * this.#taille_C);
			this.#ctx.lineTo(this.width, i * this.#taille_C);
			this.#ctx.stroke();
		}
	}
	draw(color, x, y) {
		this.#ctx.beginPath();
		this.#ctx.arc(x * this.#taille_C + this.#taille_C / 2, this.height - (y * this.#taille_C + this.#taille_C / 2), this.#taille_C / 2 - 5, 0, 2 * Math.PI);
		this.#ctx.fillStyle = color;
		this.#ctx.fill();
	}
}
const protocol = location.protocol === "https:" ? "wss://" : "ws://";
this.socket = new WebSocket(protocol + window.location.hostname + window.location.pathname);
const canvas = document.querySelector("canvas");
const game = new ClientP4(socket);
const interface = new canvasInterface(canvas, game.play.bind(game));

game.addEventListener("join", ({ detail: data }) => {
	interface.initCanvas();
	const { roomId, playerId } = data;
	const advId = playerId == 1 ? 2 : 1;
	document.documentElement.style.setProperty("--self-color", interface.getColor(playerId));
	document.documentElement.style.setProperty("--adv-color", interface.getColor(advId));
	printInfo(`Connecté à la Salle #${roomId}`);
});
game.addEventListener("play", ({ detail: data }) => {
	const { playerId, x, y, nextPlayerId } = data;
	interface.draw(interface.getColor(playerId), x, y);
	changeIndicatorState(nextPlayerId);
});
game.addEventListener("sync", ({ detail: data }) => {
	const { board, cPlayer } = data;
	if (board) {
		for (let x = 0; x < board.length; x++) {
			for (let y = 0; y < board[x].length; y++) {
				const id = board[x][y];
				id && interface.draw(interface.getColor(id), x, y);
			}
		}
	}
	changeIndicatorState(cPlayer);
});
game.addEventListener("win", ({ detail: data }) => {
	const win = data.uuid == game.uuid;
	alert(win ? "Victoire" : "Défaite");
	//win && setTimeout(() => this.socket.send(JSON.stringify({ act: "restart" })), 5000);
});
game.addEventListener("full", ({ detail: data }) => {
	alert("Match nul");
});
game.addEventListener("restart", () => interface.initCanvas());
game.addEventListener("message", ({ detail: data }) => {
	const { clientId, message } = data;
	printMessage(message, game.uuid == clientId);
});
game.addEventListener("info", ({ detail: data }) => {
	printInfo(data);
});

const container = document.getElementById("msg-area");
function printInfo(texte) {
	container.innerHTML += `<div class="text-center w-100">${texte}</div>`;
}
function printMessage(text, self) {
	container.innerHTML += `<div class="message-box"> <div class="message-${self ? "right" : "left"}"> <div class="message-bubble">${text}</div> </div> </div>`;
}
function changeIndicatorState(currentId) {
	const j1 = document.getElementById("indicator-j1");
	const j2 = document.getElementById("indicator-j2");
	j1.classList.toggle("disabled", currentId !== 1);
	j2.classList.toggle("disabled", currentId !== 2);
}
const inputBox = document.getElementById("msg");
inputBox.addEventListener("keypress", (e) => {
	if (e.charCode === 13) {
		game.message(inputBox.value);
		inputBox.value = "";
	}
});
