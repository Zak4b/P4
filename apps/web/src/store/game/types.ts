import type { RoomPlayerRef, ServerMessageData, SyncData } from "@p4/schemas/realtime";

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
	handlePlay: (data: ServerMessageData<"play">) => void;
	handleSync: (data: SyncData) => void;
	handleWin: (message: string, playerid: number) => void;
	handleDraw: () => void;
	handleJoin: (roomId: string) => void;
	handlePlayers: (players: RoomPlayerRef[]) => void;
	handlePlayerJoined: (data: RoomPlayerRef) => void;
	setLoading: (loading: boolean) => void;
	setWinDialogOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}
