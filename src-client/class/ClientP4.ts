import type { ServerMessageMap, ClientMessageMap, ServerRegisteredData, ServerJoinedData } from "../../@types.d.ts";
/*
type ServerMessageMap = import("../../src/class/gameRoom.js").ServerMessageMap;
type ClientMessageMap = import("../../src/class/gameRoom.js").ClientMessageMap;
type ServerRegisteredData = import("../../src/class/gameRoom.js").ServerRegisteredData;
type ServerJoinedData = import("../../src/class/gameRoom.js").ServerJoinedData;
*/
export class ClientP4 extends EventTarget {
	#uuid: string | null = null;
	#roomId: string | null = null;
	#playerId: number | null = null;
	socket: WebSocket;
	constructor(socket: WebSocket) {
		super();
		this.socket = socket;
		this.socket.addEventListener("message", (e) => this.messageHandler(e));
		this.listen("registered", (e) => this.#onRegistered(e));
		this.listen("join-success", (e) => this.#onJoin(e));
		this.listen("play", (e) => this.emit("play", e.detail));
		this.listen("game-win", (e) => this.emit("game-win", e.detail));
		this.listen("game-full", () => this.emit("game-full"));
		this.listen("sync", (e) => this.emit("sync", e.detail));
		this.listen("info", (e) => this.emit("info", e.detail));
		this.listen("message", (e) => this.emit("message", e.detail));
		this.listen("vote", (e) => this.emit("vote", e.detail));
		this.listen("restart", () => this.emit("restart"));
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

	send<K extends keyof ClientMessageMap>(type: K, data?: ClientMessageMap[K]) {
		this.socket.send(JSON.stringify({ type, data }));
	}
	message(text: string) {
		this.send("message", text);
	}
	join(id: string) {
		this.send("join", id);
	}
	play(x: number) {
		this.send("play", x);
	}
	addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean): void {
		console.error("addEventListener is disabled, use ClientP4.listen()");
	}

	listen<K extends keyof ServerMessageMap>(type: K, listener: (e: CustomEvent<ServerMessageMap[K]>) => void, options?: boolean | AddEventListenerOptions) {
		super.addEventListener(type, listener as EventListener, options);
	}
	emit<K extends keyof ServerMessageMap>(event: K, data?: ServerMessageMap[K]) {
		this.dispatchEvent(new CustomEvent(event, { detail: data }));
	}

	messageHandler(event: MessageEvent) {
		let message;
		try {
			message = JSON.parse(event.data);
			const { type, data } = message;
			if (/^[a-z\-]+$/i.test(String(type))) this.dispatchEvent(new CustomEvent(type, { detail: data }));
		} catch (error) {
			console.warn(error);
			// console.warn(`Message invalide: ${message}}`);
			return;
		}
		console.debug(message);
	}
	#onRegistered(e: CustomEvent<ServerRegisteredData>) {
		this.#uuid = e.detail;
		this.emit("registered", this.#uuid);
	}
	#onJoin(e: CustomEvent<ServerJoinedData>) {
		this.#roomId = e.detail.roomId;
		this.#playerId = e.detail.playerId;
		this.emit("join-success", e.detail);
	}
}

export class P4GameInterface {
	PlayerClrs: color[] = ["#000000", "#CE1D30", "#FDD334"];
	constructor(settings: { colors?: color[]; [key: string]: any }) {}
}
type color = string;
export class canvasInterface extends P4GameInterface {
	#canvas: HTMLCanvasElement;
	#canvasBase: HTMLCanvasElement;
	#canvasTokens: CanvasToken[] = [];
	#onPlayerUpdate = (id: number) => {};
	#t = 0;
	#ctx: CanvasRenderingContext2D;
	#taille_C: number = 110;
	#last: CanvasToken | null = null;

	constructor(canvas: HTMLCanvasElement, gameObject: ClientP4, settings: { colors?: color[]; width?: number; height?: number; static?: boolean; onPlayerUpdate?: (currentId: number) => void }) {
		super(settings);
		if (settings?.width || settings?.height) {
			const compare: number[] = [];
			if (settings?.width) compare.push(Math.floor(settings.width / 7));
			if (settings?.height) compare.push(Math.floor(settings.height / 6));
		}
		if (settings?.onPlayerUpdate) this.#onPlayerUpdate = settings.onPlayerUpdate;
		this.#canvas = canvas;
		this.#canvas.width = this.#taille_C * 7;
		this.#canvas.height = this.#taille_C * 6;
		const ctx = this.#canvas.getContext("2d");
		if (!(ctx instanceof CanvasRenderingContext2D)) throw new Error("Can't get Canvas drawing context");
		this.#ctx = ctx;
		this.#canvasBase = document.createElement("canvas");
		this.init();

		if (gameObject) {
			this.#canvas.addEventListener("click", (event) => {
				const { offsetX: i, offsetY: j } = event;
				const x = Math.floor(event.offsetX / (this.width / 7));
				console.debug(`Click (${i},${j}) -> c${x}`);
				gameObject.play(x);
			});

			gameObject.listen("join-success", () => this.reset());
			gameObject.listen("play", (e) => {
				const { playerId, nextPlayerId, x, y } = e.detail;
				this.push(this.getColor(playerId), x, y);
				this.#onPlayerUpdate(nextPlayerId);
			});
			gameObject.listen("sync", (e) => {
				const { cPlayer, board, last } = e.detail;
				if (last && board) this.#last = new CanvasToken(last.x, last.y, this.getColor(board[last.x][last.y]));
				this.#onPlayerUpdate(cPlayer);
				if (!board) return;
				for (let x = 0; x < board.length; x++) {
					for (let y = 0; y < board[x].length; y++) {
						const id = board[x][y];
						id && this.setToken(this.getColor(id), x, y);
					}
				}
			});
			gameObject.listen("restart", () => this.reset());
		}

		if (!settings?.static) {
			this.#loop();
		}
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
	getColor(playerId: number) {
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
		this.#canvasBase.width = this.#canvas.width;
		this.#canvasBase.height = this.#canvas.height;
		let ctx = this.#canvasBase.getContext("2d");
		if (ctx) {
			ctx.clearRect(0, 0, this.#canvasBase.width, this.#canvasBase.height);
			ctx.drawImage(this.#canvas, 0, 0, this.#canvasBase.width, this.#canvasBase.height);
		}
	}
	reset() {
		this.init();
		this.#canvasTokens = [];
		this.#last = null;
	}
	draw(color: color, x: number, y: number) {
		this.#ctx.beginPath();
		this.#ctx.arc(x * this.#taille_C + this.#taille_C / 2, this.#canvas.height - (y * this.#taille_C + this.#taille_C / 2), this.#taille_C / 2 - 5, 0, 2 * Math.PI);
		this.#ctx.fillStyle = color;
		this.#ctx.fill();
	}
	highlight(x: number, y: number) {
		this.#ctx.beginPath();
		this.#ctx.arc(x * this.#taille_C + this.#taille_C / 2, this.#canvas.height - (y * this.#taille_C + this.#taille_C / 2), this.#taille_C / 2 - 5, 0, 2 * Math.PI);
		this.#ctx.strokeStyle = "#FFFFFF";
		this.#ctx.stroke();
	}
	push(color: color, x: number, y: number) {
		const newToken = new CanvasToken(x, y, color);
		this.#canvasTokens.push(newToken);
		this.#last = newToken;
	}
	setToken(color: color, x: number, y: number) {
		this.#canvasTokens.push(new CanvasToken(x, y, color, false));
	}

	#loop(time: number = 0) {
		const t = (time - this.#t) / 1000;
		this.#t = time;
		this.#ctx.drawImage(this.#canvasBase, 0, 0, this.#canvas.width, this.#canvas.height);
		for (const token of this.#canvasTokens) {
			if (!token.static) {
				if (token.y == token.targetY) {
					token.static = true;
				} else {
					token.move(t);
				}
			}
			this.draw(token.color, token.x, token.y);
		}
		if (this.#last) {
			const { x, y } = this.#last;
			time % 3000 > 2000 && this.highlight(x, y);
		}

		requestAnimationFrame(this.#loop.bind(this));
	}
}

class CanvasToken {
	color: color;
	x: number;
	y: number = 6;
	targetY: number;
	static: boolean = false;

	constructor(x: number, y: number, color: color, animate: boolean = true) {
		this.x = x;
		this.targetY = y;
		if (!animate) {
			this.y = y;
			this.static = true;
		}
		this.color = color;
	}

	move(t: number = 0) {
		const v = 15;
		const d = v * t;
		this.y = this.y - d;
		if (this.y < this.targetY) this.y = this.targetY;
	}
}
