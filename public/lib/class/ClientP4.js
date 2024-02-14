export class ClientP4 extends EventTarget {
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
		this.socket.addEventListener("message", (e) => this.messageHandler(e));
		this.socket.addEventListener("game-registered", (e) => this.#onRegistered(e));
		this.socket.addEventListener("game-joined", (e) => this.#onJoin(e));
		this.socket.addEventListener("game-play", (e) => this.emit("play", e.detail));
		this.socket.addEventListener("game-game-win", (e) => this.emit("win", e.detail));
		this.socket.addEventListener("game-game-full", () => this.emit("full"));
		this.socket.addEventListener("game-sync", (e) => this.emit("sync", e.detail));
		this.socket.addEventListener("game-info", (e) => this.emit("info", e.detail));
		this.socket.addEventListener("game-message", (e) => this.emit("message", e.detail));
		this.socket.addEventListener("game-vote", (e) => this.emit("vote", e.detail));
		this.socket.addEventListener("game-restart", () => this.emit("restart"));
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
	/**
	 * @param {string} type
	 * @param {string | object} data
	 */
	send(type, data) {
		this.socket.send(JSON.stringify({ type, data }));
	}
	/**
	 * @param {string} text
	 */
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
		const { type, data } = message;
		if (/^[a-z\-]+$/i.test(String(type))) this.socket.dispatchEvent(new CustomEvent(`game-${type}`, { detail: data }));
	}
	#onRegistered(e) {
		this.#uuid = e.detail;
		this.send("join", 15);
		this.emit("registered", this.#uuid);
	}
	#onJoin(e) {
		this.#roomId = e.detail.roomId;
		this.#playerId = e.detail.playerId;
		this.emit("join", e.detail);
	}
}
export class P4GameInterface {
	PlayerClrs = ["#000000", "#CE1D30", "#FDD334"];
	/**
	 * @param {object} settings
	 * @param {string[]} settings.colors
	 */
	constructor(settings) {
		//const { colors } = settings;
	}
}

export class canvasInterface extends P4GameInterface {
	#dims = { w: 7, h: 6 };
	#canvas;
	#ctx;
	#taille_C = 110;

	/**
	 * @param {HTMLCanvasElement} canvas
	 * @param {object} settings
	 * @param {string[]} settings.colors
	 * @param {number} settings.width
	 * @param {number} settings.height
	 */
	constructor(canvas, clickHandler = (x) => {}, settings) {
		super(settings);
		if (settings?.width || settings?.height) {
			const compare = [];
			compare.push(Math.floor(settings?.width / 7));
			compare.push(Math.floor(settings?.height / 6));
			this.#taille_C = Math.min(...compare.filter((e) => e)); //Filter NaN
		}
		this.#canvas = canvas;
		this.#canvas.width = this.#taille_C * 7;
		this.#canvas.height = this.#taille_C * 6;
		this.#ctx = this.#canvas.getContext("2d");
		this.init();
		this.#canvas.addEventListener("click", (event) => {
			const { offsetX: i, offsetY: j } = event;
			const x = Math.floor(event.offsetX / (this.width / 7));
			console.debug(`Click (${i},${j}) -> c${x}`);
			clickHandler(x);
		});
	}
	get element() {
		return this.#canvas;
	}
	get width() {
		return this.#canvas.getBoundingClientRect().width;
	}
	get height() {
		return this.#canvas.getBoundingClientRect().height;
	}
	getColor(playerId) {
		return this.PlayerClrs[playerId];
	}
	init() {
		this.#ctx.fillStyle = "#9c9c9c";
		this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height);

		this.#ctx.strokeStyle = "#4444FF";
		this.#ctx.lineWidth = 5;
		for (let i = 0; i < 8; i++) {
			this.#ctx.beginPath();
			this.#ctx.moveTo(i * this.#taille_C, 0);
			this.#ctx.lineTo(i * this.#taille_C, this.#canvas.height);
			this.#ctx.stroke();
		}
		for (let i = 0; i < 7; i++) {
			this.#ctx.beginPath();
			this.#ctx.moveTo(0, i * this.#taille_C);
			this.#ctx.lineTo(this.#canvas.width, i * this.#taille_C);
			this.#ctx.stroke();
		}
	}
	reset() {
		this.init();
	}
	/**
	 * @param {string} color
	 * @param {number} x
	 * @param {number} y
	 */
	draw(color, x, y) {
		this.#ctx.beginPath();
		this.#ctx.arc(x * this.#taille_C + this.#taille_C / 2, this.#canvas.height - (y * this.#taille_C + this.#taille_C / 2), this.#taille_C / 2 - 5, 0, 2 * Math.PI);
		this.#ctx.fillStyle = color;
		this.#ctx.fill();
	}
}
