import { Game } from "./Game.class.js";
import { Player } from "./Player.js";
import { ServerMessage } from "./types.js";
import { TypedEventEmitter } from "./TypedEventEmitter.js";

export type RoomEvent = "join" | "leave" | "empty" | "timeout" | "end";
type RoomEventMap = {
	join: { id: number };
	leave: { id: number };
	empty: undefined;
	timeout: undefined;
	end: undefined;
};

export interface RoomProps<T extends new () => Game> {
	id: string;
	playerLimit?: number;
	game: T;
	players?: string[];
	locked?: boolean;
}

export class Room<T extends new () => Game> extends TypedEventEmitter<RoomEventMap> {
	private lastActionTimestamp: number = -1;
	private locked: boolean;
	private isEnded: boolean = false;
	readonly id: string;

	get timeStamp(): number {
		return this.lastActionTimestamp;
	}

	get playerList(): Player<T>[] {
		return Array.from(this.players.online.values());
	}

	get registeredPlayers(): { uuid: string; playerId: number }[] {
		return Array.from(this.players.registered.entries()).map(([uuid, playerId]) => ({ uuid, playerId }));
	}

	get registeredPlayerList(): Array<{ uuid: string; playerId: number }> {
		return Array.from(this.players.registered.entries()).map(([uuid, playerId]) => ({ uuid, playerId }));
	}

	readonly playerLimit: number = 2;
	readonly game: InstanceType<T>;
	private players: {
		registered: Map<string, number>;
		online: Map<string, Player<T>>;
	} = { registered: new Map(), online: new Map() };

	constructor({ id, playerLimit, game, players, locked }: RoomProps<T>) {
		super();
		this.id = id;
		this.locked = locked ?? false;
		this.playerLimit = playerLimit ?? 2;
		players?.map((p) => {
			try {
				this.addPlayer(p);
			} catch (error) {}
		});
		this.game = new game() as InstanceType<T>;
		//this.game.on("end", () => {
		//	this.lock_clean();
		//	this.emit("end");
		//});
	}
	private updateTimeStamp = () => (this.lastActionTimestamp = Date.now());
	public lock = () => (this.locked = true);
	public unlock = () => (this.locked = false);
	public lock_clean() {
		this.lock();
		this.players.online.forEach((player) => {
			this.remove(player);
		});
		this.removeAllListeners();
	}

	private addPlayer(uuid: string): number;
	private addPlayer(player: Player<T>): number;
	private addPlayer(arg: Player<T> | string): number {
		if (typeof arg === "string") {
			// arg is a uuid
			const found_player = this.players.registered.get(arg);
			if (found_player !== undefined) {
				return found_player;
			}
			throw new Error("Player not found in registered players");
		} else {
			// arg is a player
			const player = arg;
			const found_player = this.players.registered.get(player.uuid);
			if (found_player !== undefined) {
				return found_player;
			} else if (this.players.registered.size >= this.playerLimit) {
				throw new Error("No more players can be added to this room");
			}
			const used: number[] = Array.from(this.players.registered.values());
			const availableIds: number[] = [1, 2].filter((id) => !used.includes(id));
			if (availableIds.length === 0) {
				throw new Error("No more players can be added to this room");
			}
			const playerId = availableIds[0];
			this.players.registered.set(player.uuid, playerId);
			return playerId;
		}
	}

	join(player: Player<T>) {
		if (this.players.online.has(player.uuid)) {
			throw new Error("A player with this uuid is already in this room");
		}
		player.leaveRoom();
		const pid = this.addPlayer(player);
		player.localId = pid;
		this.players.online.set(player.uuid, player);
		player.room = this;
		this.updateTimeStamp();
	}

	remove(player: Player<T>) {
		this.updateTimeStamp();
		this.players.online.delete(player.uuid);
		if (this.players.online.size == 0) {
			this.emit("empty");
		}
	}

	public start() {
		this.game.start();
	}

	public end() {
		if (this.isEnded) return;
		this.isEnded = true;
		this.game.stop();
		const local_winner = this.game.winner;
		let winner: string | undefined;
		if (local_winner) {
			// TODO get winner ID
			winner = undefined;
		}
		this.send({ type: "info", data: { ended: true } });
		this.lock_clean();
	}

	public async send(msg: ServerMessage) {
		this.players.online.forEach((player) => {
			player.send(msg);
		});
	}
}
