import { boardIndex } from "@p4/schemas/realtime";
import type { TokenColor, Board } from "./types";
import { BOARD_COLS, BOARD_ROWS } from "./constants";

export const getPlayerColor = (playerId: number): TokenColor => {
	return playerId === 1 ? "player1" : "player2";
};

export const createEmptyBoard = (): Board => {
	return Array<TokenColor>(BOARD_COLS * BOARD_ROWS).fill("empty");
};

/** Lecture bornée du plateau : hors plateau, la case est considérée vide. */
export const getCell = (board: Board, x: number, y: number): TokenColor => {
	return board[boardIndex(x, y)] ?? "empty";
};

/** Écriture bornée : une coordonnée hors plateau (sync serveur incohérent) est ignorée. */
export const setCell = (board: Board, x: number, y: number, color: TokenColor): void => {
	if (x >= 0 && x < BOARD_COLS && y >= 0 && y < BOARD_ROWS) {
		board[boardIndex(x, y)] = color;
	}
};
