import { Game } from "./Game.class.js";
import { Room } from "./Room.js";
import { Player } from "./Player.js";
import { v4 as uuidv4 } from "uuid";
import { ServerMessage } from "./types.js";

export type OnPlayerJoinRoom<T extends new () => Game> = (player: Player<T>) => void;

export class RoomManager<T extends new () => Game> {
	private _list: Map<string, Room<T>> = new Map();
	private players = new Map<string, Player<T>>();
	private matchmakingQueue: Player<T>[] = [];
	private matchmakingHandlers = new Map<string, () => void>();

	private playerLimit: number;
	private onPlayerJoinRoom?: OnPlayerJoinRoom<T>;
	static defaultTimeoutDelay: number = 300000;
	gameClass: T;

	constructor(playerMaxCount: number, gameClass: T, onPlayerJoinRoom?: OnPlayerJoinRoom<T>) {
		this.playerLimit = playerMaxCount;
		this.gameClass = gameClass;
		this.onPlayerJoinRoom = onPlayerJoinRoom;
	}
	get list() {
		return this._list;
	}

	public get(roomId: string): Room<T> | undefined {
		return this._list.get(roomId);
	}

	public getOrCreate(roomId: string): Room<T> {
		//TODO delete
		if (!this._list.has(roomId)) {
			const newRoom = this._newRoom({ id: roomId });
			return newRoom;
		}
		return this.get(roomId) as Room<T>;
	}

	public newRoom({ name, timeout }: { name?: string; timeout?: number } = {}): Room<T> {
		return this._newRoom({ name, timeout });
	}

	private _newRoom({ id, name, timeout }: { id?: string; name?: string; timeout?: number } = {}): Room<T> {
		id ??= uuidv4();
		const room = new Room({
			id,
			name: name ?? id,
			playerLimit: this.playerLimit,
			game: this.gameClass,
		});
		const roomTimeout = !timeout || timeout <= 0 ? RoomManager.defaultTimeoutDelay : timeout;
		this.setupRoomEvents(room, roomTimeout);
		this._list.set(id, room);
		return room;
	}

	private setupRoomEvents(room: Room<T>, timeoutDelay: number) {
		let timer: NodeJS.Timeout;
		const timeout_callback = () => {
			if (timer) clearTimeout(timer);
			timer = setTimeout(() => {
				if (room.timeStamp + timeoutDelay < Date.now()) {
					room.off("empty", timeout_callback);
					room.emit("timeout");
				}
			}, timeoutDelay + 10);
		};
		// Kill room if the room is empty for too long
		room.on("empty", timeout_callback);

		// Kill room if no player joins
		const timerJoin = setTimeout(() => room.emit("timeout"), timeoutDelay);
		room.once("join", () => clearTimeout(timerJoin));

		room.on("end", () => {
			// TODO save game result
			setTimeout(() => this.deleteRoom(room.id), 1000);
		});
		room.on("timeout", () => {
			this.deleteRoom(room.id);
		});
	}

	private deleteRoom(roomId: string): void {
		const room = this.get(roomId);
		if (!room) return;
		room.lock_clean();
		this._list.delete(room.id);
	}

	public join(roomId: string, player: Player<T>): void {
		const room = this.getOrCreate(roomId);

		if (!room) {
			const msg = `GameRoom "${roomId}" not found`;
			player.send({ type: "error", data: { message: msg } });
			throw new Error(msg);
		}
		room.join(player);
		this.onPlayerJoinRoom?.(player);
	}

	public leave(player: Player<T>) {
		player.room?.remove(player);
	}

	public register(player: Player<T>) {
		this.players.set(player.uuid, player);
		player.socket.on("close", () => this.players.delete(player.uuid));
	}

	public async send(playerId: string, msg: ServerMessage) {
		const player = this.players.get(playerId);
		if (player) player.send(msg);
	}

	public async broadcast(msg: ServerMessage) {
		this.players.forEach((player) => {
			player.send(msg);
		});
	}

	// --- Matchmaking ---

	public joinMatchmaking(player: Player<T>): void {
		if (this.matchmakingQueue.some((p) => p.uuid === player.uuid)) {
			console.log("[matchmaking] join: already in queue", { uuid: player.uuid, displayName: player.displayName });
			return;
		}
		player.leaveRoom();
		this.matchmakingQueue.push(player);
		const handler = () => this.leaveMatchmaking(player);
		this.matchmakingHandlers.set(player.uuid, handler);
		player.socket.on("disconnect", handler);
		console.log("[matchmaking] join", { uuid: player.uuid, displayName: player.displayName, queueSize: this.matchmakingQueue.length });
		this.tryMatch();
	}

	public leaveMatchmaking(player: Player<T>): void {
		const idx = this.matchmakingQueue.findIndex((p) => p.uuid === player.uuid);
		if (idx === -1) {
			console.log("[matchmaking] leave: not in queue", { uuid: player.uuid, displayName: player.displayName });
			return;
		}
		this.matchmakingQueue.splice(idx, 1);
		const handler = this.matchmakingHandlers.get(player.uuid);
		if (handler) {
			player.socket.off("disconnect", handler);
			this.matchmakingHandlers.delete(player.uuid);
		}
		console.log("[matchmaking] leave", { uuid: player.uuid, displayName: player.displayName, queueSize: this.matchmakingQueue.length });
	}

	private tryMatch(): void {
		console.log("[matchmaking] tryMatch", { queueSize: this.matchmakingQueue.length });
		if (this.matchmakingQueue.length < 2) return;
		const [p1, p2] = this.matchmakingQueue.splice(0, 2);
		console.log("[matchmaking] match found", { p1: { uuid: p1.uuid, displayName: p1.displayName }, p2: { uuid: p2.uuid, displayName: p2.displayName } });
		[p1, p2].forEach((p) => {
			const handler = this.matchmakingHandlers.get(p.uuid);
			if (handler) {
				p.socket.off("disconnect", handler);
				this.matchmakingHandlers.delete(p.uuid);
			}
		});
		const room = this.newRoom({});
		room.join(p1);
		room.join(p2);
		[p1, p2].forEach((p) => {
			console.log("MATCH SEND", p.displayName);
			p.send({ type: "matched", data: { roomId: room.id, playerId: p.localId } });
			this.onPlayerJoinRoom?.(p);
		});
		console.log("[matchmaking] room created", { roomId: room.id, players: room.playerList.map((p) => ({ uuid: p.uuid, displayName: p.displayName, localId: p.localId })) });
	}
}
