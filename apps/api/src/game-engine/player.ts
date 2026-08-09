import { Game } from "./game.js";
import { Room } from "./room.js";
import type { ServerMessage } from "@p4/schemas/realtime";
import type { AuthenticatedSocket } from "../realtime/socket-auth.js";
import { emitServerMessage } from "../realtime/socket-emit.js";

export class Player<T extends new () => Game> {
	public readonly uuid: string;
	public readonly displayName: string;
	private _localId: number | null = null;
	public readonly socket: AuthenticatedSocket;
	private _room: Room<T> | null = null;

	constructor(socket: AuthenticatedSocket, uuid: string, displayName: string) {
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
		}
		this._room = room;
	}

	clearRoom(): void {
		this._room = null;
		this._localId = null;
	}

	public async send(msg: ServerMessage) {
		emitServerMessage(this.socket, msg);
	}

	leaveRoom() {
		this.room?.remove(this);
	}
}
