import { create } from "zustand";
import type { GamePlayer, ServerMessageData, SyncData } from "@p4/schemas/realtime";
import type { GameStore, Board } from "./types";
import { createEmptyBoard, getPlayerColor, setCell } from "./utils";

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
		{ localId: 1, id: null, login: null },
		{ localId: 2, id: null, login: null },
	],

	handlePlay: (data: ServerMessageData<"play">) => {
		const { playerId, x, y, nextPlayerId } = data;

		set((state) => {
			const newBoard = state.gameState.board.map((col) => [...col]);
			setCell(newBoard, x, y, getPlayerColor(playerId));

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

	handleSync: (data: SyncData) => {
		const { board, cPlayer, last } = data;

		const newBoard: Board = createEmptyBoard();

		if (board) {
			for (let x = 0; x < board.length; x++) {
				const column = board[x] ?? [];
				for (let y = 0; y < column.length; y++) {
					const playerId = column[y];
					if (playerId) {
						setCell(newBoard, x, y, getPlayerColor(playerId));
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

	handlePlayers: (players: GamePlayer[]) => {
		const seated = new Map(players.filter((p) => p.localId !== null).map((p) => [p.localId, p]));
		set({
			players: [1, 2].map((localId) => {
				const player = seated.get(localId);
				return { localId, id: player?.id ?? null, login: player?.login ?? null };
			}),
		});
	},

	handlePlayerJoined: (data: GamePlayer) => {
		if (data.localId === null) return;
		const localId = data.localId;

		set((state) => {
			const existing = state.players.find((p) => p.localId === localId);
			if (existing) {
				return {
					players: state.players.map((p) =>
						p.localId === localId ? { ...p, id: data.id, login: data.login } : p
					),
				};
			}
			return {
				players: [...state.players, { localId, id: data.id, login: data.login }].sort(
					(a, b) => a.localId - b.localId
				),
			};
		});
	},

	handleJoin: (roomId: string) => {
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

	setWinDialogOpen: (open) => {
		set((state) => ({
			winDialogOpen: typeof open === "function" ? open(state.winDialogOpen) : open,
		}));
	},
}));
