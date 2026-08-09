import { BOARD_COLS, BOARD_ROWS, boardIndex } from "@p4/schemas/realtime";
import { Game } from "./game.js";
import { Timer } from "./timer.js";

type Move = { x: number; y: number };

type P4EventMap = {
	end: { winner: number; duration: number };
	play: Move & { nextPlayerId: number };
	reset: undefined;
};

export class P4 extends Game<P4EventMap> {
	private running: boolean = false;
	private ended: boolean = false;
	private timer: Timer;

	private _board: number[] = [];
	private _moves: number[] = [];
	private currentPlayer: 1 | 2 = 1;
	private lastMove?: Move;
	private winnerIndex: number | undefined = undefined;
	private _playCount: number = 0;

	override readonly pidValues: number[] = [1, 2];

	get board() {
		return [...this._board];
	}

	get moves(): number[] {
		return [...this._moves];
	}

	private column(x: number): number[] {
		const start = boardIndex(x, 0);
		return this._board.slice(start, start + BOARD_ROWS);
	}

	private row(y: number): number[] {
		return Array.from({ length: BOARD_COLS }, (_, col) => this.cell(col, y));
	}

	private cell(x: number, y: number): number {
		const value = this._board[boardIndex(x, y)];
		if (value === undefined) {
			throw new Error(`Invalid cell ${x},${y}`);
		}
		return value;
	}

	private setCell(x: number, y: number, value: number): void {
		this._board[boardIndex(x, y)] = value;
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

	public stop(): void {
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

	public reset(): void {
		//this.running = false;
		this.ended = false;
		this._board = Array.from({ length: BOARD_COLS * BOARD_ROWS }, () => 0);
		this.currentPlayer = 1;
		this.lastMove = undefined;
		this.winnerIndex = undefined;
		this._playCount = 0;
		this._moves = [];
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
		const y = this.column(x).indexOf(0);
		if (y === -1) {
			throw new Error("Column is full");
		}
		this.playMove({ x, y });
		return { x, y };
	}

	private playMove(move: Move): void {
		this.setCell(move.x, move.y, this.currentPlayer);
		this._moves.push(move.x);
		this.lastMove = move;
		this._playCount++;
		if (this.check(move.x, move.y)) {
			return this.endWithWinner(this.currentPlayer);
		}
		if (this.checkDraw()) {
			return this.end();
		}
		this.updateCurrentPlayer();
	}

	private updateCurrentPlayer() {
		this.currentPlayer = this.currentPlayer === 2 ? 1 : 2;
	}

	// Diag "/"
	private diag1(x: number, y: number): string {
		// (-1, -1)
		const backSteps = Math.min(x, y);
		const startX = x - backSteps;
		const startY = y - backSteps;
		const length = Math.min(BOARD_COLS - 1 - startX, BOARD_ROWS - 1 - startY) + 1;

		let result = "";
		for (let i = 0; i < length; i++) {
			result += this.cell(startX + i, startY + i).toString();
		}
		return result;
	}

	// Diag "\"
	private diag2(x: number, y: number): string {
		// (-1, +1)
		const backSteps = Math.min(x, BOARD_ROWS - 1 - y);
		const startX = x - backSteps;
		const startY = y + backSteps;
		const length = Math.min(BOARD_COLS - 1 - startX, startY) + 1;

		let result = "";
		for (let i = 0; i < length; i++) {
			result += this.cell(startX + i, startY - i).toString();
		}
		return result;
	}

	private getCombinations(x: number, y: number): { c: string; r: string; d1: string; d2: string } {
		return {
			c: this.column(x).map(String).join(""),
			r: this.row(y).join(""),
			d1: this.diag1(x, y),
			d2: this.diag2(x, y),
		};
	}

	private check(x: number, y: number): boolean {
		if (this.winnerIndex) {
			return true;
		}
		const playerId = this.cell(x, y);
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
		return this._board.every((cell) => cell !== 0);
	}
}
