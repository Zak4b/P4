import { Game } from "./game.js";
import { Timer } from "./timer.js";

type Move = { x: number; y: number; };

type P4EventMap = {
	end: { winner: number, duration: number };
	play: Move & { nextPlayerId: number };
	reset: undefined;
};

export class P4 extends Game<P4EventMap> {
	private running: boolean = false;
	private ended: boolean = false;
	private timer: Timer;

	private _board: number[][] = [];
	private currentPlayer: 1 | 2 = 1;
	private lastMove?: Move;
	private winnerIndex: number | undefined = undefined;
	private _playCount: number = 0;

	readonly pidValues:number[] = [1, 2];

	get board() {
		return this._board.map(col => [...col]);
	}
	get cPlayer() {
		return this.currentPlayer;
	}
	get last() {
		return this.lastMove;
	}
	get isEnded() {
		return this.ended;
	}
	get playCount() {
		return this._playCount;
	}

	get winner(): number | undefined {
		return this.winnerIndex;
	}

	get elapsedTime(): number {
		return this.timer.elapsed;
	}

	public start(): void {
		this.running = true;
		this.timer.start();
	}

	public	stop(): void {
		this.running = false;
		this.timer.stop();
	}
	public end(): void {
		if (this.ended) {
			return;
		}
		this.ended = true;
		this.running = false;
		this.timer.stop();
		if (this.winnerIndex === undefined) {
			this.winnerIndex = 0;
		}
		this.emit("end", { winner: this.winnerIndex, duration: this.timer.elapsed });
	}

	private endWithWinner(winner: number): void {
		if (this.ended) {
			return;
		}
		this.winnerIndex = winner;
		this.end();
	}

	constructor() {
		super();
		this.timer = new Timer();
		this.reset();
	}
	
	public reset():void {
		//this.running = false;
		this.ended = false;
		this._board = Array.from({ length: 7 }, () => Array.from({ length: 6 }, () => 0));
		this.currentPlayer = 1;
		this.lastMove = undefined;
		this.winnerIndex = undefined;
		this._playCount = 0;
		this.timer.reset();
		this.start(); // temp
		this.emit("reset");
	}

	public async play(playerId: number, x: number): Promise<Move> {
		if (this.isEnded || !this.running) {
			throw new Error("Game is not running", { cause: { isEnded: this.isEnded, running: this.running } });
		}
		if (playerId !== this.currentPlayer) {
			throw new Error("Invalid player");
		}
		if (x < 0 || x > 6) {
			throw new Error("Invalid column");
		}
		// `board` clone tout le plateau : ici on lit la colonne directement.
		const y = this._board[x].indexOf(0);
		if (y === -1) {
			throw new Error("Column is full");
		}
		this.playMove({ x, y });
		return { x, y };
	}

	private playMove(move: Move): void {
		this._board[move.x][move.y] = this.currentPlayer;
		this.lastMove = move;
		this._playCount++;
		if (this.check(move.x, move.y)) {
			return this.endWithWinner(this.currentPlayer);
		}else if (this.checkDraw()) {
			return this.end();
		}
		this.updateCurrentPlayer();
	}

	private updateCurrentPlayer() {
		this.currentPlayer = this.currentPlayer == 2 ? 1 : 2;
	}

	private getCombinations(x: number, y: number): { c: string; r: string; d1: string; d2: string; } {
		let d1 = "";
		let d2 = "";
		const c = this._board[x].map(String).join("");
		const r = this._board
			.map((col) => col[y])
			.map(String)
			.join("");

		const z1 = Math.min(x, y);
		const xz1 = x - z1;
		const yz1 = y - z1;
		const rg1 = Math.min(6 - xz1, 5 - yz1) + 1;
		for (let i = 0; i < rg1; i++) {
			d1 += this._board[i + xz1][i + yz1].toString();
		}

		const z2 = Math.min(6 - x, y);
		const xz2 = x + z2;
		const yz2 = y - z2;
		const rg2 = Math.min(xz2, 5 - yz2) + 1;
		for (let i = 0; i < rg2; i++) {
			d2 += this._board[xz2 - i][i + yz2].toString();
		}
		d2 = d2.split("").reverse().join("");

		return { c: c, r: r, d1: d1, d2: d2 };
	}

	private check(x: number, y: number): boolean {
		if (this.winnerIndex) {
			return true;
		}
		const playerId = this._board[x][y];
		// Les quatre alignements passant par (x, y), séparés par "|" pour qu'une
		// série ne puisse pas se poursuivre d'un alignement à l'autre.
		const combinations = Object.values(this.getCombinations(x, y)).join("|");
		if (!new RegExp(`${playerId}{4,}`).test(combinations)) {
			return false;
		}
		this.winnerIndex = playerId;
		return true;
	}
	
	private checkDraw(): boolean {
		return this._board.every((col) => col[5] !== 0);
	}
	
}
