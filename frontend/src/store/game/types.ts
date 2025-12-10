import { SyncEvent, PlayEvent, WinEvent } from "@/lib/socketTypes";

export type TokenColor = "empty" | "player1" | "player2";
export type Board = TokenColor[][];

export interface GameState {
	board: Board;
	currentPlayer: number;
	lastMove: { x: number; y: number } | null;
	winningPlayer: number | null;
	isDraw: boolean;
	isWin: boolean;
	loading: boolean;
	currentRoomId: string | null;
}

export interface GameStore {
	gameState: GameState;
	animatingTokens: Set<string>;
	winDialogOpen: boolean;
	winMessage: string;
	
	// Actions
	initializeBoard: () => void;
	handlePlay: (data: PlayEvent) => void;
	handleSync: (data: SyncEvent) => void;
	handleWin: (message: string, playerid: number) => void;
	handleDraw: () => void;
	handleRestart: () => void;
	handleJoin: (roomId: string, playerId: number | null) => void;
	setLoading: (loading: boolean) => void;
	setAnimatingTokens: (tokens: Set<string> | ((prev: Set<string>) => Set<string>)) => void;
	setWinDialogOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
	setWinMessage: (message: string | ((prev: string) => string)) => void;
}

