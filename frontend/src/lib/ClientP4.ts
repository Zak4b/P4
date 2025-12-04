import { Socket } from "socket.io-client";

export class ClientP4 extends EventTarget {
	private _uuid: string | null = null;
	private _roomId: string | null = null;
	private _playerId: number | null = null;
	private socket: Socket;
	constructor(socket: Socket) {
		super();
		this.socket = socket;

		// Écouter les événements Socket.IO
		this.socket.on("registered", (uuid: string) => this.onRegistered(uuid));
		this.socket.on("joined", (data: { roomId: string; playerId: number }) => this.onJoin(data));
		this.socket.on("play", (data: any) => this.emit("play", data));
		this.socket.on("win", (data: any) => this.emit("win", data));
		this.socket.on("game-win", (data: any) => this.emit("win", data));
		this.socket.on("full", () => this.emit("full", undefined));
		this.socket.on("game-full", () => this.emit("full", undefined));
		this.socket.on("sync", (data: any) => this.emit("sync", data));
		this.socket.on("info", (data: any) => this.emit("info", data));
		this.socket.on("message", (data: any) => this.emit("message", data));
		this.socket.on("vote", (data: any) => this.emit("vote", data));
		this.socket.on("restart", () => this.emit("restart", undefined));
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
		if (!this.socket.connected) {
			console.warn(`Cannot send message: Socket.IO is not connected.`);
			return;
		}
		this.socket.emit(type, data);
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

	private onRegistered(uuid: string) {
		this._uuid = uuid;
		this.emit("registered", this._uuid);
	}
	private onJoin(data: { roomId: string; playerId: number }) {
		this._roomId = data.roomId;
		this._playerId = data.playerId;
		this.emit("join", data);
	}
}
