import { Game } from "./Game.class.js";
import { Room } from "./Room.js";
import { Player } from "./Player.js";
import { v4 as uuidv4 } from "uuid";
import { ServerMessage } from "./types.js";

export class RoomManager<T extends new () => Game> {
	private _list: Map<string, Room<T>> = new Map();
	private players = new Map<string, Player<T>>();

	private playerLimit: number;
	static defaultTimeoutDelay: number = 300000;
	gameClass: T;

	constructor(playerMaxCount: number, gameClass: T) {
		this.playerLimit = playerMaxCount;
		this.gameClass = gameClass;
	}
	get list() {
		return this._list;
	}

	public get(roomId: string): Room<T> | undefined {
		return this.list.get(roomId);
	}

	public getOrCreate(roomId: string): Room<T> {
		if (!this.list.has(roomId)) {
			this.list.set(roomId, this.newRoom());
		}
		return this.get(roomId) as Room<T>;
	}

	private newRoom({ timeout }: { timeout?: number } = {}): Room<T> {
		const room = new Room({
			id: uuidv4(),
			playerLimit: this.playerLimit,
			game: this.gameClass,
		});
		const roomTimeout = !timeout || timeout <= 0 ? RoomManager.defaultTimeoutDelay : timeout;
		this.setupRoomEvents(room, roomTimeout);
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

		room.on("end", (e) => {
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
}
