import { TokenColor, Board } from "./types";
import { BOARD_COLS, BOARD_ROWS } from "./constants";

export const getPlayerColor = (playerId: number): TokenColor => {
	return playerId === 1 ? "player1" : "player2";
};

export const createEmptyBoard = (): Board => {
	return Array(BOARD_COLS)
		.fill(null)
		.map(() => Array(BOARD_ROWS).fill("empty" as TokenColor));
};

