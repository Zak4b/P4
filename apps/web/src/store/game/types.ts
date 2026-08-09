import type { GamePlayer, ServerMessageData, SyncData } from "@p4/schemas/realtime";

export type TokenColor = "empty" | "player1" | "player2";
export type Board = TokenColor[];

/** Un siège de la partie. `id`/`login` à `null` tant que personne ne l'occupe. */
export interface Player {
	localId: number;
	id: string | null;
	login: string | null;
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
	handlePlay: (data: ServerMessageData<"game:p4:play">) => void;
	handleSync: (data: SyncData) => void;
	handleWin: (message: string, playerid: number) => void;
	handleDraw: () => void;
	handleJoin: (roomId: string) => void;
	handlePlayers: (players: GamePlayer[]) => void;
	handlePlayerJoined: (data: GamePlayer) => void;
	setLoading: (loading: boolean) => void;
	setWinDialogOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}
