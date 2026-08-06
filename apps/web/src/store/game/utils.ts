import type { TokenColor, Board } from "./types";
import { BOARD_COLS, BOARD_ROWS } from "./constants";

export const getPlayerColor = (playerId: number): TokenColor => {
	return playerId === 1 ? "player1" : "player2";
};

export const createEmptyBoard = (): Board => {
	return Array(BOARD_COLS)
		.fill(null)
		.map(() => Array(BOARD_ROWS).fill("empty" as TokenColor));
};

/** Lecture bornée du plateau : hors plateau, la case est considérée vide. */
export const getCell = (board: Board, x: number, y: number): TokenColor => {
	return board[x]?.[y] ?? "empty";
};

/** Écriture bornée : une coordonnée hors plateau (sync serveur incohérent) est ignorée. */
export const setCell = (board: Board, x: number, y: number, color: TokenColor): void => {
	const column = board[x];
	if (column && y >= 0 && y < column.length) {
		column[y] = color;
	}
};

