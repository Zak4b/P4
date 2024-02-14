import { v4 as uuidv4 } from "uuid";
import { WebSocket } from "ws";
import { EventEmitter } from "events";

export class Player {
	/** @type {string} */
	#uuid;
	/** @type {number} */
	#playerId = null;
	/** @type {WebSocket} */
	#socket;
	/** @type {GameRoom} */
	#room = null;

	#data;
	/**
	 * @param {WebSocket} socket
	 */
	constructor(socket, uuid = null) {
		this.#socket = socket;
		this.#data = new Map();
		this.#uuid = uuid ?? uuidv4();
		socket.on("close", (code) => {
			this?.room?.remove(this);
		});
	}
	get uuid() {
		return this.#uuid;
	}
	get playerId() {
		return this.#playerId;
	}

	get data() {
		return this.#data;
	}
	/**
	 * @param {number} id
	 */
	set playerId(id) {
		this.#playerId = id;
	}
	get room() {
		return this.#room;
	}
	/**
	 * @param {GameRoom} room
	 */
	set room(room) {
		if (!(room instanceof GameRoom)) {
			throw new Error("Not a GameRoom");
		} else {
			this.#room = room;
		}
	}
	/**
	 * @param {string} type
	 * @param {string} data
	 */
	async send(type, data) {
		this.#socket.send(JSON.stringify({ type, data }));
	}
}
export class GameRoom extends EventEmitter {
	/** @template GameClass */
	/**@type {number} */
	#timestamp;
	/** @type {string} */
	#id = null;
	/** @type {number} */
	#playerMaxCount = 2;
	/**@type {GameClass} */
	#game = null;
	/** @type {{uuid:string, playerId:number}[]} */
	#registeredPlayers = [];
	/** @type {Player[]} */
	#onlinePlayerList = [];
	/** @type {Player[]} */
	#spectList = [];
	/**
	 * @param {string} id
	 * @param {number} playerMaxCount
	 * @param {new() => GameClass} gameClass
	 */
	constructor(id, playerMaxCount, gameClass) {
		super();
		this.#id = id;
		if (playerMaxCount) this.#playerMaxCount = playerMaxCount;
		if (gameClass) this.#game = new gameClass();
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
	/**
	 * @param {Player} player
	 * @returns {number}
	 */
	#register(player) {
		/**@type {Player} */
		const fplayer = this.#registeredPlayers.find((p) => p.uuid === player.uuid);
		if (fplayer) {
			return fplayer.playerId;
		} else if (this.#registeredPlayers.length >= this.playerMaxCount) {
			throw new Error("Toutes les places sont déjà réservés");
		}
		const used = this.#registeredPlayers.map((p) => p.playerId);
		const playerId = [...this.#game.pidValues].filter((id) => !used.includes(id)).shift();
		this.#registeredPlayers.push({ uuid: player.uuid, playerId });
		return playerId;
	}
	/**
	 * @param {Player} player
	 */
	join(player) {
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
	/**
	 * @param {Player} player
	 */
	remove(player) {
		this.#updateTimeStamp();
		this.#onlinePlayerList = this.#onlinePlayerList.filter((e) => e.uuid != player.uuid);
		this.#spectList = this.#spectList.filter((e) => e.uuid != player.uuid);
		if (this.playerCount == 0) {
			this.emit("empty");
		}
	}
	spect(player) {
		player.room?.remove(player);
		this.#spectList.push(player);
		player.playerId = null;
		player.room = this;
	}
	/**
	 * @param {String} type
	 * @param {String} data
	 */
	async send(type, data) {
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
export class GameRoomList {
	/** @template GameClass */
	/** @type {GameRoom[]} */
	#list;
	/** @type {number} */
	#playerMaxCount;
	/** @type {number} */
	#timeout = 300000;
	/** @type {new() => GameClass} */
	#gameClass;
	/**
	 * @param {number} playerMaxCount
	 * @param {new() => GameClass} gameClass
	 */
	constructor(playerMaxCount, gameClass) {
		this.#list = {};
		if (playerMaxCount) this.#playerMaxCount = playerMaxCount;
		if (gameClass) this.#gameClass = gameClass;
	}
	get list() {
		return this.#list;
	}
	/**
	 * @param {string} roomId
	 * @returns {GameRoom | false}
	 */
	get(roomId) {
		return this.#list[roomId] ?? false;
	}
	/**
	 * @param {string} roomId
	 * @returns {GameRoom}
	 */
	getOrCreate(roomId) {
		if (!this.#list[roomId]) {
			this.#list[roomId] = this.#newRoom(roomId);
		}
		return this.get(roomId);
	}
	/**
	 * @param {string} roomId
	 * @returns {GameRoom}
	 */
	#newRoom(roomId) {
		const room = new GameRoom(roomId, this.#playerMaxCount, this.#gameClass);
		let timer = null;
		const cb = () => {
			clearTimeout(timer);
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
	/**
	 * @param {string} roomId
	 * @param {Player} player
	 * @returns {GameRoom}
	 */
	join(roomId, player) {
		return this.getOrCreate(roomId).join(player);
	}
}
