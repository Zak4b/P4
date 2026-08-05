import { create } from "zustand";
import { PlayEvent, PlayerJoinedEvent, PlayersEvent, SyncEvent } from "@/lib/socketTypes";
import { GameStore, Board, Player } from "./types";
import { createEmptyBoard, getPlayerColor } from "./utils";

export const useGameStore = create<GameStore>((set, get) => ({
	gameState: {
		board: createEmptyBoard(),
		currentPlayer: 1,
		lastMove: null,
		winningPlayer: null,
		isDraw: false,
		isWin: false,
		loading: false,
		currentRoomId: null,
	},
	animatingTokens: new Set<string>(),
	winDialogOpen: false,
	winMessage: "",
	players: [
		{ localId: 1, name: null },
		{ localId: 2, name: null },
	],

	initializeBoard: () => {
		set((state) => ({
			gameState: {
				...state.gameState,
				board: createEmptyBoard(),
				lastMove: null,
				winningPlayer: null,
				isDraw: false,
				isWin: false,
			},
			animatingTokens: new Set(),
		}));
	},

	handlePlay: (data: PlayEvent) => {
		const { playerId, x, y, nextPlayerId } = data;

		set((state) => {
			const newBoard = state.gameState.board.map((col) => [...col]);
			newBoard[x][y] = getPlayerColor(playerId);
			
			const tokenKey = `${x}-${y}`;
			const newAnimatingTokens = new Set(state.animatingTokens);
			newAnimatingTokens.add(tokenKey);

			// Retirer l'animation après sa durée
			setTimeout(() => {
				set((s) => {
					const next = new Set(s.animatingTokens);
					next.delete(tokenKey);
					return { animatingTokens: next };
				});
			}, 400);

			return {
				gameState: {
					...state.gameState,
					board: newBoard,
					currentPlayer: nextPlayerId,
					lastMove: { x, y },
				},
				animatingTokens: newAnimatingTokens,
			};
		});
	},

	handleSync: (data: SyncEvent) => {
		const { board, cPlayer, last } = data;

		const newBoard: Board = createEmptyBoard();

		if (board) {
			for (let x = 0; x < board.length; x++) {
				for (let y = 0; y < board[x].length; y++) {
					const playerId = board[x][y];
					if (playerId) {
						newBoard[x][y] = getPlayerColor(playerId);
					}
				}
			}
		}

		set((state) => ({
			gameState: {
				...state.gameState,
				board: newBoard,
				currentPlayer: cPlayer,
				lastMove: last || null,
				isDraw: false,
				isWin: false,
				winningPlayer: null,
				loading: false,
			},
			animatingTokens: new Set(),
		}));
	},

	handleWin: (message: string, playerid: number) => {
		set((state) => ({
			gameState: {
				...state.gameState,
				winningPlayer: playerid,
				isWin: true,
			},
			winMessage: message,
			winDialogOpen: true,
		}));
	},

	handleDraw: () => {
		set({
			winMessage: "🤝 Match nul !",
			winDialogOpen: true,
			gameState: {
				...get().gameState,
				isDraw: true,
			},
		});
	},

	handleRestart: () => {
		get().initializeBoard();
	},

	handlePlayers: (players: PlayersEvent[]) => {
		const byId = new Map(players.map((p) => [p.localId, p.name]));
		set({
			players: [
				{ localId: 1, name: byId.get(1) ?? null },
				{ localId: 2, name: byId.get(2) ?? null },
			],
		});
	},

	handlePlayerJoined: (data: PlayerJoinedEvent) => {
		set((state) => {
			const existing = state.players.find((p) => p.localId === data.localId);
			if (existing) {
				return {
					players: state.players.map((p) =>
						p.localId === data.localId ? { ...p, name: data.name } : p
					),
				};
			}
			return {
				players: [...state.players, { localId: data.localId, name: data.name }].sort(
					(a, b) => a.localId - b.localId
				),
			};
		});
	},

	handleJoin: (roomId: string, _playerId: number | null) => {
		// TODO playerid ?
		void _playerId;
		set((state) => ({
			gameState: {
				...state.gameState,
				loading: false,
				currentRoomId: roomId,
			},
		}));
	},

	setLoading: (loading: boolean) => {
		set((state) => ({
			gameState: {
				...state.gameState,
				loading,
			},
		}));
	},

	setAnimatingTokens: (tokens) => {
		set((state) => ({
			animatingTokens: typeof tokens === "function" ? tokens(state.animatingTokens) : tokens,
		}));
	},

	setWinDialogOpen: (open) => {
		set((state) => ({
			winDialogOpen: typeof open === "function" ? open(state.winDialogOpen) : open,
		}));
	},

	setWinMessage: (message) => {
		set((state) => ({
			winMessage: typeof message === "function" ? message(state.winMessage) : message,
		}));
	},

	setPlayers: (players: Player[] | ((prev: Player[]) => Player[])) => {
		set((state) => ({
			players: typeof players === "function" ? players(state.players) : players,
		}));
	},
}));

