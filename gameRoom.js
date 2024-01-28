const uuid = require("uuid");
class Player {
	#uuid = null;
	#playerId = null;
	#socket = null;
	#room = null;

	constructor(socket) {
		this.#socket = socket;
		this.#uuid = uuid.v4();
		socket.on("close", (code) => {
			this?.room?.remove(this);
			console.log(`Connexion fermée avec le code : ${code}`);
			delete this;
		});
	}
	get uuid() {
		return this.#uuid;
	}
	get playerId() {
		return this.#playerId;
	}
	set playerId(id) {
		this.#playerId = id;
	}
	get room() {
		return this.#room;
	}
	set room(room) {
		if (!(room instanceof GameRoom)) {
			throw new Error("Not a GameRoom");
		} else {
			this.#room = room;
		}
	}
	send(act, data) {
		this.#socket.send(JSON.stringify({ act, data }));
	}
}
class GameRoom {
	#id = null;
	#playerMaxCount = 2;
	#game = null;
	#playerList = [];

	constructor(id, playerMaxCount, gameClass) {
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

	join(player) {
		if (this.#playerList.length >= this.#playerMaxCount) {
			throw new Error("Room pleine");
		} else if (!(player instanceof Player)) {
			throw new Error("Not a Player");
		} else {
			this.#playerList.push(player);
			player.room = this;
		}
		player.playerId = this.#playerList.length; // Ne marche que pour 2, modif à faire
	}

	remove(player) {
		this.#playerList = this.#playerList.filter((e) => e.uuid != player.uuid);
	}
	send(act, data) {
		this.#playerList.forEach((player) => {
			player.send(act, data);
		});
	}
}
class GameRoomList {
	#list;
	#playerMaxCount;
	#gameClass;
	constructor(playerMaxCount, gameClass) {
		this.#list = {};
		if (playerMaxCount) this.#playerMaxCount = playerMaxCount;
		if (gameClass) this.#gameClass = gameClass;
	}

	getOrCreate(id) {
		if (!this.#list[id]) this.#list[id] = new GameRoom(id, this.#playerMaxCount, this.#gameClass);
		return this.#list[id];
	}

	join(id, player) {
		return this.getOrCreate(id).join(player);
	}
}
module.exports = { Player, GameRoom, GameRoomList };
