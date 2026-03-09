import { io, Socket } from "socket.io-client";
import { type Board } from "./minimax.js";
import { getMove, type DifficultyConfig, DIFFICULTY_PRESETS, DEFAULT_DIFFICULTY } from "./difficulty.js";

type SyncData = { playerId: number | null; cPlayer: number; board?: Board; last?: { x: number; y: number } };
type PlayData = { playerId: number; x: number; y: number; nextPlayerId: number };

export class AIClient {
	private socket: Socket;
	private board: Board = Array.from({ length: 7 }, () => Array(6).fill(0));
	private myPlayerId: number | null = null;
	private roomId: string;
	private config: DifficultyConfig;
	private gameOver: boolean = false;

	constructor(backendWsUrl: string, roomId: string, token: string, config: DifficultyConfig = DIFFICULTY_PRESETS[DEFAULT_DIFFICULTY]) {
		this.roomId = roomId;
		this.config = config;

		this.socket = io(backendWsUrl, {
			path: "/api/socket.io",
			extraHeaders: {
				authorization: `Bearer ${token}`,
			},
			reconnection: false,
		});

		this.setupListeners();
	}

	private setupListeners(): void {
		this.socket.on("connect", () => {
			console.log(`[AI] Connected — joining room ${this.roomId}`);
			this.socket.emit(
				"join",
				this.roomId,
				(response: { success: boolean; playerId?: number; error?: string }) => {
					if (response.success) {
						console.log(`[AI] Joined room ${this.roomId} as player ${response.playerId}`);
					} else {
						console.error(`[AI] Failed to join room: ${response.error}`);
						this.socket.disconnect();
					}
				}
			);
		});

		// Receives state on join or after a game restart
		this.socket.on("sync", (data: SyncData) => {
			if (data.playerId !== null && data.playerId !== undefined) {
				this.myPlayerId = data.playerId;
			}
			// If board is absent, the game was just reset — clear our state
			this.board = data.board ?? Array.from({ length: 7 }, () => Array(6).fill(0));
			this.gameOver = false;
			if (this.myPlayerId !== null && data.cPlayer === this.myPlayerId) {
				this.scheduleMove();
			}
		});

		// A piece was played — update board and play if it's our turn
		this.socket.on("play", (data: PlayData) => {
			if (this.gameOver) return;
			this.board[data.x][data.y] = data.playerId;
			if (this.myPlayerId !== null && data.nextPlayerId === this.myPlayerId) {
				this.scheduleMove();
			}
		});

		this.socket.on("game-win", () => {
			console.log("[AI] Game ended (win) — staying connected for potential restart");
			this.gameOver = true;
		});

		this.socket.on("game-draw", () => {
			console.log("[AI] Game ended (draw) — staying connected for potential restart");
			this.gameOver = true;
		});

		this.socket.on("connect_error", (err: Error) => {
			console.error(`[AI] Connection error: ${err.message}`);
		});

		this.socket.on("disconnect", (reason: string) => {
			console.log(`[AI] Disconnected: ${reason}`);
		});
	}

	private scheduleMove(): void {
		setTimeout(() => this.playBestMove(), this.config.moveDelay);
	}

	private playBestMove(): void {
		if (this.myPlayerId === null || this.gameOver) return;
		const col = getMove(this.board, this.myPlayerId as 1 | 2, this.config);
		console.log(`[AI] Playing column ${col}`);
		this.socket.emit("play", col);
	}
}
