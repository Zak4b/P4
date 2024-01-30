const uuid = require("uuid");
const WebSocket = require("ws");
const { EventEmitter } = require("events");

class Player {
	/** @type {string} */
	#uuid = null;
	/** @type {number} */
	#playerId = null;
	/** @type {WebSocket} */
	#socket = null;
	/** @type {GameRoom} */
	#room = null;
	/**
	 * @param {WebSocket} socket
	 */
	constructor(socket) {
		this.#socket = socket;
		this.#uuid = uuid.v4();
		socket.on("close", (code) => {
			this?.room?.remove(this);
			console.log(`Connexion fermée avec le code : ${code}`);
		});
	}
	get uuid() {
		return this.#uuid;
	}
	get playerId() {
		return this.#playerId;
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
	 * @param {string} act
	 * @param {string} data
	 */
	send(act, data) {
		this.#socket.send(JSON.stringify({ act, data }));
	}
}
class GameRoom extends EventEmitter {
	/** @template GameClass */
	/** @type {string} */
	#id = null;
	/** @type {number} */
	#playerMaxCount = 2;
	/**@type {GameClass} */
	#game = null;
	/** @type {Player[]} */
	#playerList = [];
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
		return this.#playerList.length;
	}
	get playerList() {
		return this.#playerList;
	}
	/**
	 * @param {Player} player
	 */
	join(player) {
		if (this.#playerList.length >= this.#playerMaxCount) {
			throw new Error("Room pleine");
		} else if (!(player instanceof Player)) {
			throw new Error("Not a Player");
		}
		player.room?.remove(player);
		const len = this.#playerList.push(player);
		player.playerId = len == 1 ? 1 : this.#playerList[len - 2].playerId == 1 ? 2 : 1; // Ne marche que pour 2, modif à faire
		player.room = this;
	}
	/**
	 * @param {Player} player
	 */
	remove(player) {
		this.#playerList = this.#playerList.filter((e) => e.uuid != player.uuid);
		if (this.playerCount == 0) {
			this.emit("empty");
		}
	}
	/**
	 * @param {String} act
	 * @param {String} data
	 */
	send(act, data) {
		this.#playerList.forEach((player) => {
			player.send(act, data);
		});
	}
}
class GameRoomList {
	/** @template GameClass */
	/** @type {object} */
	#list;
	/** @type {number} */
	#playerMaxCount;
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
	/**
	 * @param {string} roomId
	 * @returns {GameRoom}
	 */
	getOrCreate(roomId) {
		if (!this.#list[roomId]) {
			this.#list[roomId] = this.#newRoom(roomId);
		}
		return this.#list[roomId];
	}
	#newRoom(roomId) {
		const room = new GameRoom(roomId, this.#playerMaxCount, this.#gameClass);
		const cb = () => {
			delete this.#list[room.id];
			room.off("empty", cb);
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
module.exports = { Player, GameRoom, GameRoomList };
