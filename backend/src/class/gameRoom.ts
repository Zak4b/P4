import { v4 as uuidv4 } from "uuid";
import { WebSocket } from "ws";
import { EventEmitter } from "events";

export abstract class Game {
	get pidValues(): number[] { return [1,2]}
}

export class Player<T extends new () => Game> {
	#uuid: string;
	#playerId: number|null = null;
	#socket: WebSocket;
	#room: GameRoom<T>|null = null;

	#data;
	constructor(socket: WebSocket, uuid :string|null = null) {
		this.#socket = socket;
		this.#data = new Map();
		this.#uuid = uuid ?? uuidv4();
		socket.on("close", () => {
			this.room?.remove(this);
		});
	}
	get uuid() :string{
		return this.#uuid;
	}
	get playerId() :number|null{
		return this.#playerId;
	}

	get data() {
		return this.#data;
	}
	set playerId(id: number|null) {
		this.#playerId = id;
	}
	get room():GameRoom<T>|null {
		return this.#room;
	}
	set room(room: GameRoom<T>) {
		if (!(room instanceof GameRoom)) {
			throw new Error("Not a GameRoom");
		} else {
			this.#room = room;
		}
	}
	async send(type: string, data?: string|object) {
		this.#socket.send(JSON.stringify({ type, data }));
	}
}
export class GameRoom <T extends new () => Game> extends EventEmitter{
	#timestamp: number = -1;
	#id: string;
	#playerMaxCount: number = 2;
	#game: InstanceType<T>;
	#registeredPlayers: { uuid: string; playerId: number; }[] = [];
	#onlinePlayerList: Player<T>[] = [];
	#spectList: Player<T>[] = [];
	
	constructor(id: string, playerMaxCount: number, gameClass: T) {
		super();
		this.#id = id;
		this.#playerMaxCount = playerMaxCount;
		this.#game = new gameClass() as InstanceType<T>;
	}
	get id() {
		return this.#id;
	}
	get playerMaxCount() {
		return this.#playerMaxCount;
	}
	get game() {
		return this.#game;
	}
	get playerCount() {
		return this.#onlinePlayerList.length;
	}
	get playerList() {
		return this.#onlinePlayerList;
	}
	get registeredPlayerList() {
		return this.#registeredPlayers;
	}
	get timeStamp() {
		return this.#timestamp;
	}
	#updateTimeStamp() {
		this.#timestamp = Date.now();
	}
	
	#register(player: Player<T>): number {
		const fplayer = this.#registeredPlayers.find((p) => p.uuid === player.uuid);
		if (fplayer) {
			return fplayer.playerId;
		} else if (this.#registeredPlayers.length >= this.playerMaxCount) {
			throw new Error("Toutes les places sont déjà réservés");
		}
		const used = this.#registeredPlayers.map((p) => p.playerId);
		const playerId = [...this.#game.pidValues].filter((id) => !used.includes(id)).shift() as number; 
		this.#registeredPlayers.push({ uuid: player.uuid, playerId });
		return playerId;
	}
	
	join(player: Player<T>) {
		if (!(player instanceof Player)) {
			throw new Error("Not a Player");
		} else if (this.#onlinePlayerList.find((p) => p.uuid === player.uuid)) {
			throw new Error("Une instance du joueur est déjà dans la salle");
		}
		player.room?.remove(player);
		const pid = this.#register(player);
		player.playerId = pid;
		this.#onlinePlayerList.push(player);
		player.room = this;
		this.#updateTimeStamp();
	}
	
	remove(player: Player<T>) {
		this.#updateTimeStamp();
		this.#onlinePlayerList = this.#onlinePlayerList.filter((p) => p.uuid != player.uuid);
		this.#spectList = this.#spectList.filter((s) => s.uuid != player.uuid);
		if (this.playerCount == 0) {
			this.emit("empty");
		}
	}

	spect(player:Player<T>) {
		player.room?.remove(player);
		this.#spectList.push(player);
		player.playerId = null;
		player.room = this;
	}
	
	async send(type: string, data?: string|object) {
		for (const player of this.#onlinePlayerList) {
			player.send(type, data);
		}
		if (type !== "message") {
			for (const spect of this.#spectList) {
				spect.send(type, data);
			}
		}
	}
}
export class GameRoomList<T extends new () => Game> {
	#list: {[key: string]:GameRoom<T>} = {};
	#playerMaxCount: number;
	#timeout: number = 300000;
	#gameClass: T;

	constructor(playerMaxCount: number, gameClass: T) {
		this.#playerMaxCount = playerMaxCount;
		this.#gameClass = gameClass;
	}
	get list() {
		return this.#list;
	}
	
	get(roomId: string): GameRoom<T> | false {
		return this.#list[roomId] ?? false;
	}
	
	getOrCreate(roomId: string): GameRoom<T> {
		if (!this.#list[roomId]) {
			this.#list[roomId] = this.#newRoom(roomId);
		}
		return this.get(roomId) as GameRoom<T>;
	}
	
	#newRoom(roomId: string): GameRoom<T> {
		const room = new GameRoom(roomId, this.#playerMaxCount, this.#gameClass);
		let timer:NodeJS.Timeout;
		const cb = () => {
			timer && clearTimeout(timer);
			timer = setTimeout(() => {
				if (room.timeStamp + this.#timeout < Date.now()) {
					delete this.#list[room.id];
					room.off("empty", cb);
				}
			}, this.#timeout);
		};
		room.on("empty", cb);
		return room;
	}
	
	join(roomId: string, player: Player<T>) {
		this.getOrCreate(roomId).join(player);
	}
}
