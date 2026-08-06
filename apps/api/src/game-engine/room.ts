import { Game } from "./game.js";
import { Player } from "./player.js";
import { RoomBroadcaster, ServerMessage } from "./types.js";
import { TypedEventEmitter } from "./typed-event-emitter.js";
import { P4 } from "./p4.js";
import { gameRoom } from "../realtime/socket-rooms.js";

export type GameEndPayload = {
	winner: number;
	registeredPlayers: { uuid: string; playerId: number }[];
	duration: number;
	board: number[][];
};
type RoomEventMap = {
	join: { id: number };
	leave: { id: number };
	empty: undefined;
	timeout: undefined;
	end: undefined;
	/** La partie de la room est terminée (victoire ou nul) ; à charge de l'appelant de persister/notifier. */
	"game-end": GameEndPayload;
};

export interface RoomProps<T extends new () => Game> {
	id: string;
	name?: string;
	playerLimit?: number;
	game: T;
	locked?: boolean;
	/** Liste des UUID autorisés à rejoindre (vide/undefined = tout le monde) */
	players?: string[];
	broadcaster: RoomBroadcaster;
}

export class Room<T extends new () => Game> extends TypedEventEmitter<RoomEventMap> {
	private lastActionTimestamp: number = -1;
	private locked: boolean;
	private isEnded: boolean = false;
	readonly id: string;
	readonly name: string;

	get timeStamp(): number {
		return this.lastActionTimestamp;
	}

	get playerList(): Player<T>[] {
		return Array.from(this.players.online.values());
	}

	get registeredPlayers(): { uuid: string; playerId: number }[] {
		return Array.from(this.players.registered.entries()).map(([uuid, playerId]) => ({ uuid, playerId }));
	}

	readonly playerLimit: number = 2;
	readonly game: InstanceType<T>;
	private readonly allowedPlayerIds: Set<string> | null;
	private readonly broadcaster: RoomBroadcaster;
	private players: {
		registered: Map<string, number>;
		online: Map<string, Player<T>>;
	} = { registered: new Map(), online: new Map() };

	constructor({ id, name, playerLimit, game, players, locked, broadcaster }: RoomProps<T>) {
		super();
		this.id = id;
		this.name = name ?? id;
		this.locked = locked ?? false;
		this.playerLimit = playerLimit ?? 2;
		this.allowedPlayerIds = players && players.length > 0 ? new Set(players) : null;
		this.broadcaster = broadcaster;
		this.game = new game() as InstanceType<T>;
		this.game.on("end", ({ winner, duration }) => {
			const G = this.game as P4; //TODO generic

			this.emit("game-end", {
				winner,
				registeredPlayers: this.registeredPlayers,
				duration,
				board: G.board,
			});
			//this.lock_clean();
			//this.emit("end");
		});
	}
	private updateTimeStamp = () => (this.lastActionTimestamp = Date.now());
	public lock = () => (this.locked = true);
	public unlock = () => (this.locked = false);
	public lock_clean() {
		this.lock();
		this.game.stop();
		this.players.online.forEach((player) => {
			this.remove(player);
		});
		this.broadcaster.evictRoom(this.id);
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
		if (this.allowedPlayerIds && !this.allowedPlayerIds.has(player.uuid)) {
			throw new Error("You are not allowed to join this room");
		}
		if (this.players.online.has(player.uuid)) {
			throw new Error("A player with this uuid is already in this room");
		}
		player.leaveRoom();
		const pid = this.addPlayer(player);
		player.localId = pid;
		this.players.online.set(player.uuid, player);
		player.room = this;
		void player.socket.join(gameRoom(this.id));
		this.updateTimeStamp();
		this.emit("join", { id: pid });
	}

	remove(player: Player<T>) {
		this.updateTimeStamp();
		this.players.online.delete(player.uuid);
		void player.socket.leave(gameRoom(this.id));
		player.clearRoom();
		if (this.players.online.size == 0) {
			this.emit("empty");
		}
	}

	swapPlayerSlots(a: Player<T>, b: Player<T>): void {
		const idA = this.players.registered.get(a.uuid);
		const idB = this.players.registered.get(b.uuid);
		if (idA === undefined || idB === undefined) {
			return;
		}
		this.players.registered.set(a.uuid, idB);
		this.players.registered.set(b.uuid, idA);
		a.localId = idB;
		b.localId = idA;
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
		this.send({ type: "info", data: "ended" });
		this.lock_clean();
	}

	public async send(msg: ServerMessage) {
		this.broadcaster.toRoom(this.id, msg);
	}
}
