export class ClientP4 extends EventTarget {
	private _uuid: string | null = null;
	private _roomId: string | null = null;
	private _playerId: number | null = null;
	private socket: WebSocket;
	constructor(socket: WebSocket) {
		super();
		this.socket = socket;
		this.socket.addEventListener("message", (e) => this.messageHandler(e));
		this.socket.addEventListener("game-registered", (e: CustomEvent) => this.#onRegistered(e));
		this.socket.addEventListener("game-joined", (e: CustomEvent) => this.#onJoin(e));
		this.socket.addEventListener("game-play", (e: CustomEvent) => this.emit("play", e.detail));
		this.socket.addEventListener("game-game-win", (e: CustomEvent) => this.emit("win", e.detail));
		this.socket.addEventListener("game-game-full", () => this.emit("full", undefined));
		this.socket.addEventListener("game-sync", (e: CustomEvent) => this.emit("sync", e.detail));
		this.socket.addEventListener("game-info", (e: CustomEvent) => this.emit("info", e.detail));
		this.socket.addEventListener("game-message", (e: CustomEvent) => this.emit("message", e.detail));
		this.socket.addEventListener("game-vote", (e: CustomEvent) => this.emit("vote", e.detail));
		this.socket.addEventListener("game-restart", () => this.emit("restart", undefined));
	}
	get uuid() {
		return this._uuid;
	}
	get roomId() {
		return this._roomId;
	}
	get playerId() {
		return this._playerId;
	}
	public send(type: string, data?: any) {
		this.socket.send(JSON.stringify({ type, data }));
	}
	public message(text: string) {
		this.send("message", text);
	}
	public join(id: string) {
		this.send("join", id);
	}
	public play(x: number) {
		this.send("play", x);
	}
	private emit(event: string, data: string | {}) {
		this.dispatchEvent(new CustomEvent(event, { detail: data }));
	}

	messageHandler(event: MessageEvent<any>) {
		let message: { type: any; data: any };
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
	#onRegistered(e: { detail: string }) {
		this._uuid = e.detail;
		this.emit("registered", this._uuid);
	}
	#onJoin(e: CustomEvent<{ roomId: string; playerId: number }>) {
		this._roomId = e.detail.roomId;
		this._playerId = e.detail.playerId;
		this.emit("join", e.detail);
	}
}
//ctx.fillStyle = "#ffc107";
//ctx.fillStyle = "#dc3545";
export class P4GameInterface {
	PlayerClrs = ["#000000", "#CE1D30", "#FDD334"];
	constructor(settings: any) {
		//const { colors } = settings;
	}
}

type P4Settings = {
	colors?: string[];
	width?: number;
	height?: number;
	static?: boolean;
	onPlayerUpdate?: (currentId: number) => void;
};

export class canvasInterface extends P4GameInterface {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private canvasBase: HTMLCanvasElement;
	private tokens: CanvasToken[] = [];
	private t: number = 0;
	readonly cell_size: number = 110;
	private last = null;
	private onPlayerUpdate: (currentId: number) => void = () => {};

	constructor(client: ClientP4, settings: P4Settings = {}) {
		if (!client) throw new Error("ClientP4 is required");
		super(settings);
		if (settings?.width || settings?.height) {
			const compare: number[] = [];
			compare.push(Math.floor(settings?.width / 7));
			compare.push(Math.floor(settings?.height / 6));
			this.cell_size = Math.min(...compare.filter((e) => e)); //Filter NaN
		}
		this.canvas = document.createElement("canvas");
		this.canvas.style.maxWidth = "100%";
		this.canvas.style.height = "auto";
		this.canvas.style.cursor = "pointer";
		this.canvas.classList.add("mw-100", "border", "border-secondary", "rounded");
		this.canvas.width = this.cell_size * 7;
		this.canvas.height = this.cell_size * 6;
		this.ctx = this.canvas.getContext("2d");
		this.init();

		this.canvas.addEventListener("click", (event) => {
			const { offsetX: i, offsetY: j } = event;
			const x = Math.floor(event.offsetX / (this.width / 7));
			console.debug(`Click (${i},${j}) -> c${x}`);
			client.play(x);
		});

		client.addEventListener("join", () => this.reset());
		client.addEventListener("play", (e: CustomEvent) => {
			const { playerId, nextPlayerId, x, y } = e.detail;
			this.push(this.getColor(playerId), x, y);
			this.onPlayerUpdate(nextPlayerId);
		});
		client.addEventListener("sync", (e: CustomEvent) => {
			const { cPlayer, board, last } = e.detail;
			if (last) this.last = last;
			this.onPlayerUpdate(cPlayer);
			if (!board) return;
			for (let x = 0; x < board.length; x++) {
				for (let y = 0; y < board[x].length; y++) {
					const id = board[x][y];
					id && this.setToken(this.getColor(id), x, y);
				}
			}
		});
		client.addEventListener("restart", () => this.reset());

		if (!settings?.static) {
			this.loop();
		}
	}
	get element() {
		return this.canvas;
	}
	get width() {
		return this.canvas.getBoundingClientRect().width;
	}
	get height() {
		return this.canvas.getBoundingClientRect().height;
	}
	public getColor(playerId: number) {
		return this.PlayerClrs[playerId];
	}
	private init() {
		this.ctx.fillStyle = "#9c9c9c";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.ctx.strokeStyle = "#4444FF";
		this.ctx.lineWidth = 5;
		for (let i = 0; i < 8; i++) {
			this.ctx.beginPath();
			this.ctx.moveTo(i * this.cell_size, 0);
			this.ctx.lineTo(i * this.cell_size, this.canvas.height);
			this.ctx.stroke();
		}
		for (let i = 0; i < 7; i++) {
			this.ctx.beginPath();
			this.ctx.moveTo(0, i * this.cell_size);
			this.ctx.lineTo(this.canvas.width, i * this.cell_size);
			this.ctx.stroke();
		}
		this.canvasBase = document.createElement("canvas");
		this.canvasBase.width = this.canvas.width;
		this.canvasBase.height = this.canvas.height;
		const tmpctx = this.canvasBase.getContext("2d");
		tmpctx.drawImage(this.canvas, 0, 0, this.canvasBase.width, this.canvasBase.height);
	}
	private reset() {
		this.init();
		this.tokens = [];
		this.last = null;
	}
	private draw(color: string | CanvasGradient | CanvasPattern, x: number, y: number) {
		this.ctx.beginPath();
		this.ctx.arc(x * this.cell_size + this.cell_size / 2, this.canvas.height - (y * this.cell_size + this.cell_size / 2), this.cell_size / 2 - 5, 0, 2 * Math.PI);
		this.ctx.fillStyle = color;
		this.ctx.fill();
	}
	private highlight(x: number, y: number) {
		this.ctx.beginPath();
		this.ctx.arc(x * this.cell_size + this.cell_size / 2, this.canvas.height - (y * this.cell_size + this.cell_size / 2), this.cell_size / 2 - 5, 0, 2 * Math.PI);
		this.ctx.strokeStyle = "#FFFFFF";
		this.ctx.stroke();
	}
	private push(color: string, x: any, y: any) {
		const newToken = new CanvasToken(x, y, color);
		this.tokens.push(newToken);
		this.last = newToken;
	}
	private setToken(color: string, x: number, y: number) {
		this.tokens.push(new CanvasToken(x, y, color, false));
	}

	private loop(time = 0) {
		const t = (time - this.t) / 1000;
		this.t = time;
		this.ctx.drawImage(this.canvasBase, 0, 0, this.canvas.width, this.canvas.height);
		for (const token of this.tokens) {
			if (!token.static) {
				if (token.y == token.targetY) {
					token.static = true;
				} else {
					token.move(t);
				}
			}
			this.draw(token.color, token.x, token.y);
		}
		if (this.last) {
			const { x, y } = this.last;
			time % 3000 > 2000 && this.highlight(x, y);
		}

		requestAnimationFrame(this.loop.bind(this));
	}
}

class CanvasToken {
	readonly color: any;
	x: number;
	y: number = 6;
	targetY: number;
	static = false; //TODO

	constructor(x: number, y: number, color: any, animate = true) {
		this.x = x;
		this.targetY = y;
		if (!animate) {
			this.y = y;
			this.static = true;
		}
		this.color = color;
	}

	public move(t = 0) {
		const v = 15;
		const d = v * t;
		this.y = this.y - d;
		if (this.y < this.targetY) this.y = this.targetY;
	}
}
