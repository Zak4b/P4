import { io, Socket } from "socket.io-client";
import type { Board, GameEngine } from "./games/GameEngine.js";
import { getMove, type DifficultyConfig, DIFFICULTY_PRESETS, DEFAULT_DIFFICULTY } from "./difficulty.js";

type SyncData = { playerId: number | null; cPlayer: number; board?: Board; last?: { x: number; y: number } };
type PlayData = { playerId: number; x: number; y: number; nextPlayerId: number };

// Délai d'inactivité avant que l'IA quitte la partie (5 minutes)
const IDLE_TIMEOUT_MS = 5 * 60 * 1000;

export class AIClient {
	private socket: Socket;
	private board: Board;
	private engine: GameEngine;
	private myPlayerId: number | null = null;
	private roomId: string;
	private config: DifficultyConfig;
	private gameOver: boolean = false;
	private idleTimer: ReturnType<typeof setTimeout> | null = null;

	constructor(
		backendWsUrl: string,
		roomId: string,
		token: string,
		config: DifficultyConfig = DIFFICULTY_PRESETS[DEFAULT_DIFFICULTY],
		engine: GameEngine
	) {
		this.roomId = roomId;
		this.config = config;
		this.engine = engine;
		this.board = engine.createBoard();

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
			this.board = data.board ?? this.engine.createBoard();
			this.gameOver = false;
			if (this.myPlayerId !== null && data.cPlayer === this.myPlayerId) {
				this.scheduleMove();
			} else {
				// C'est le tour du joueur humain — démarrer le minuteur d'inactivité
				this.resetIdleTimer();
			}
		});

		// A piece was played — update board and play if it's our turn
		this.socket.on("play", (data: PlayData) => {
			if (this.gameOver) return;
			this.board = this.engine.applyMove(this.board, data.x, data.playerId);
			if (this.myPlayerId !== null && data.nextPlayerId === this.myPlayerId) {
				this.clearIdleTimer();
				this.scheduleMove();
			} else {
				// Tour du joueur humain — (re)démarrer le minuteur d'inactivité
				this.resetIdleTimer();
			}
		});

		this.socket.on("game-win", () => {
			console.log("[AI] Game ended (win) — staying connected for potential restart");
			this.gameOver = true;
			this.clearIdleTimer();
		});

		this.socket.on("game-draw", () => {
			console.log("[AI] Game ended (draw) — staying connected for potential restart");
			this.gameOver = true;
			this.clearIdleTimer();
		});

		this.socket.on("connect_error", (err: Error) => {
			console.error(`[AI] Connection error: ${err.message}`);
		});

		this.socket.on("disconnect", (reason: string) => {
			console.log(`[AI] Disconnected: ${reason}`);
		});
	}

	private resetIdleTimer(): void {
		this.clearIdleTimer();
		this.idleTimer = setTimeout(() => {
			console.log(`[AI] Joueur inactif depuis ${IDLE_TIMEOUT_MS / 60000} minutes — déconnexion`);
			this.socket.disconnect();
		}, IDLE_TIMEOUT_MS);
	}

	private clearIdleTimer(): void {
		if (this.idleTimer !== null) {
			clearTimeout(this.idleTimer);
			this.idleTimer = null;
		}
	}

	private scheduleMove(): void {
		setTimeout(() => this.playBestMove(), this.config.moveDelay);
	}

	private playBestMove(): void {
		if (this.myPlayerId === null || this.gameOver) return;
		// Vérifier qu'il reste des coups valides (protection contre la race condition
		// où "play" arrive avec nextPlayerId=AI juste avant "game-draw" quand le
		// plateau est plein — ce cas est courant avec le mode match nul)
		if (this.engine.getValidMoves(this.board).length === 0) return;
		try {
			const col = getMove(this.board, this.myPlayerId as 1 | 2, this.config, this.engine);
			console.log(`[AI] Playing column ${col}`);
			this.socket.emit("play", col);
		} catch (err) {
			console.error("[AI] Erreur lors du calcul du coup :", err);
		}
	}
}
