import { v4 as uuidv4 } from "uuid";
import { EventEmitter } from "events";
export class Game {
    get pidValues() { return [1, 2]; }
}
export class Player {
    #uuid;
    #playerId = null;
    #socket;
    #room = null;
    #data;
    constructor(socket, uuid = null) {
        this.#socket = socket;
        this.#data = new Map();
        this.#uuid = uuid ?? uuidv4();
        socket.on("close", () => {
            this.room?.remove(this);
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
    set playerId(id) {
        this.#playerId = id;
    }
    get room() {
        return this.#room;
    }
    set room(room) {
        if (!(room instanceof GameRoom)) {
            throw new Error("Not a GameRoom");
        }
        else {
            this.#room = room;
        }
    }
    async send(type, data) {
        this.#socket.send(JSON.stringify({ type, data }));
    }
}
export class GameRoom extends EventEmitter {
    #timestamp = -1;
    #id;
    #playerMaxCount = 2;
    #game;
    #registeredPlayers = [];
    #onlinePlayerList = [];
    #spectList = [];
    constructor(id, playerMaxCount, gameClass) {
        super();
        this.#id = id;
        this.#playerMaxCount = playerMaxCount;
        this.#game = new gameClass();
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
    #register(player) {
        const fplayer = this.#registeredPlayers.find((p) => p.uuid === player.uuid);
        if (fplayer) {
            return fplayer.playerId;
        }
        else if (this.#registeredPlayers.length >= this.playerMaxCount) {
            throw new Error("Toutes les places sont déjà réservés");
        }
        const used = this.#registeredPlayers.map((p) => p.playerId);
        const playerId = [...this.#game.pidValues].filter((id) => !used.includes(id)).shift();
        this.#registeredPlayers.push({ uuid: player.uuid, playerId });
        return playerId;
    }
    join(player) {
        if (!(player instanceof Player)) {
            throw new Error("Not a Player");
        }
        else if (this.#onlinePlayerList.find((p) => p.uuid === player.uuid)) {
            throw new Error("Une instance du joueur est déjà dans la salle");
        }
        player.room?.remove(player);
        const pid = this.#register(player);
        player.playerId = pid;
        this.#onlinePlayerList.push(player);
        player.room = this;
        this.#updateTimeStamp();
    }
    remove(player) {
        this.#updateTimeStamp();
        this.#onlinePlayerList = this.#onlinePlayerList.filter((p) => p.uuid != player.uuid);
        this.#spectList = this.#spectList.filter((s) => s.uuid != player.uuid);
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
    #list = {};
    #playerMaxCount;
    #timeout = 300000;
    #gameClass;
    constructor(playerMaxCount, gameClass) {
        this.#playerMaxCount = playerMaxCount;
        this.#gameClass = gameClass;
    }
    get list() {
        return this.#list;
    }
    get(roomId) {
        return this.#list[roomId] ?? false;
    }
    getOrCreate(roomId) {
        if (!this.#list[roomId]) {
            this.#list[roomId] = this.#newRoom(roomId);
        }
        return this.get(roomId);
    }
    #newRoom(roomId) {
        const room = new GameRoom(roomId, this.#playerMaxCount, this.#gameClass);
        let timer;
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
    join(roomId, player) {
        this.getOrCreate(roomId).join(player);
    }
}
