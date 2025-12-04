import { v4 as uuidv4 } from "uuid";
import { Socket } from "socket.io";
import { Game } from "./Game.class.js";
import { Room } from "./Room.js";
import { ServerMessage } from "./types.js";

export class Player<T extends new () => Game> {
	public readonly uuid: string;
	private _localId: number | null = null;
	public readonly socket: Socket;
	private _room: Room<T> | null = null;

	constructor(socket: Socket, uuid: string | null = null) {
		this.socket = socket;
		this.uuid = uuid ?? uuidv4();
		socket.on("disconnect", () => {
			this.leaveRoom();
		});
	}
	get localId(): number | null {
		return this._localId;
	}

	set localId(id: number | null) {
		this._localId = id;
	}

	get room(): Room<T> | null {
		return this._room;
	}

	set room(room: Room<T>) {
		if (!(room instanceof Room)) {
			throw new Error("Not a GameRoom");
		} else {
			this._room = room;
		}
	}

	public async send(msg: ServerMessage) {
		console.debug(`Sending message to player ${this.uuid}:`, msg);
		// Utiliser socket.emit() pour que le frontend puisse écouter les événements nommés
		this.socket.emit(msg.type, msg.data);
	}

	leaveRoom() {
		this.room?.remove(this);
	}
}
