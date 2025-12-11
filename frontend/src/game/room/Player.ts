import { v4 as uuidv4 } from "uuid";
import { Socket } from "socket.io";
import { Game } from "./Game.class";
import { Room } from "./Room";
import { ServerMessage } from "./types";

export class Player<T extends new () => Game> {
	public readonly uuid: string;
	public readonly displayName: string;
	private _localId: number | null = null;
	public readonly socket: Socket;
	private _room: Room<T> | null = null;

	constructor(socket: Socket, uuid: string, displayName:string) {
		this.socket = socket;
		this.uuid = uuid;
		this.displayName = displayName;
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
		// Utiliser socket.emit() pour que le frontend puisse écouter les événements nommés
		this.socket.emit(msg.type, msg.data);
	}

	leaveRoom() {
		this.room?.remove(this);
	}
}
