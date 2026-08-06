import type { SyncEvent, PlayEvent, PlayersEvent, PlayerJoinedEvent } from "@/lib/socketTypes";

export type TokenColor = "empty" | "player1" | "player2";
export type Board = TokenColor[][];

export interface Player {
	localId: number;
	name: string | null;
}

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
	players: Player[];

	// Actions
	handlePlay: (data: PlayEvent) => void;
	handleSync: (data: SyncEvent) => void;
	handleWin: (message: string, playerid: number) => void;
	handleDraw: () => void;
	handleJoin: (roomId: string) => void;
	handlePlayers: (players: PlayersEvent[]) => void;
	handlePlayerJoined: (data: PlayerJoinedEvent) => void;
	setLoading: (loading: boolean) => void;
	setWinDialogOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}
