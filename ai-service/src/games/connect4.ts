import type { GameEngine, Board } from "./GameEngine.js";
import {
	WINDOW_4_AI,
	WINDOW_3_AI,
	WINDOW_2_AI,
	WINDOW_3_OPP,
	CENTER_COLUMN_BONUS,
} from "../values.js";

const COLS = 7;
const ROWS = 6;

function scoreWindow(window: number[], player: number): number {
	const opp = player === 1 ? 2 : 1;
	const pc = window.filter((c) => c === player).length;
	const ec = window.filter((c) => c === 0).length;
	const oc = window.filter((c) => c === opp).length;
	if (pc === 4) return WINDOW_4_AI;
	if (pc === 3 && ec === 1) return WINDOW_3_AI;
	if (pc === 2 && ec === 2) return WINDOW_2_AI;
	if (oc === 3 && ec === 1) return WINDOW_3_OPP;
	return 0;
}

/**
 * Moteur de jeu Puissance 4 — plateau 7×6, gravité, 4-en-ligne.
 * Implémente GameEngine pour fonctionner avec le minimax générique.
 */
export const connect4Engine: GameEngine = {
	createBoard(): Board {
		return Array.from({ length: COLS }, () => Array(ROWS).fill(0));
	},

	getValidMoves(board: Board): number[] {
		return Array.from({ length: COLS }, (_, i) => i).filter((c) => board[c][ROWS - 1] === 0);
	},

	applyMove(board: Board, col: number, player: number): Board {
		const newBoard = board.map((c) => [...c]);
		const row = newBoard[col].indexOf(0);
		newBoard[col][row] = player;
		return newBoard;
	},

	checkWinner(board: Board, player: number): boolean {
		// Horizontal
		for (let r = 0; r < ROWS; r++) {
			for (let c = 0; c < COLS - 3; c++) {
				if (
					board[c][r] === player &&
					board[c + 1][r] === player &&
					board[c + 2][r] === player &&
					board[c + 3][r] === player
				) return true;
			}
		}
		// Vertical
		for (let c = 0; c < COLS; c++) {
			for (let r = 0; r < ROWS - 3; r++) {
				if (
					board[c][r] === player &&
					board[c][r + 1] === player &&
					board[c][r + 2] === player &&
					board[c][r + 3] === player
				) return true;
			}
		}
		// Diagonale /
		for (let c = 0; c < COLS - 3; c++) {
			for (let r = 0; r < ROWS - 3; r++) {
				if (
					board[c][r] === player &&
					board[c + 1][r + 1] === player &&
					board[c + 2][r + 2] === player &&
					board[c + 3][r + 3] === player
				) return true;
			}
		}
		// Diagonale \
		for (let c = 3; c < COLS; c++) {
			for (let r = 0; r < ROWS - 3; r++) {
				if (
					board[c][r] === player &&
					board[c - 1][r + 1] === player &&
					board[c - 2][r + 2] === player &&
					board[c - 3][r + 3] === player
				) return true;
			}
		}
		return false;
	},

	isTerminal(board: Board): boolean {
		return (
			connect4Engine.checkWinner(board, 1) ||
			connect4Engine.checkWinner(board, 2) ||
			board.every((col) => col[ROWS - 1] !== 0)
		);
	},

	evaluate(board: Board, aiPlayer: number): number {
		let score = 0;
		// Bonus colonne centrale
		score += board[3].filter((c) => c === aiPlayer).length * CENTER_COLUMN_BONUS;
		// Fenêtres horizontales
		for (let r = 0; r < ROWS; r++) {
			const row = board.map((col) => col[r]);
			for (let c = 0; c < COLS - 3; c++) {
				score += scoreWindow(row.slice(c, c + 4), aiPlayer);
			}
		}
		// Fenêtres verticales
		for (let c = 0; c < COLS; c++) {
			for (let r = 0; r < ROWS - 3; r++) {
				score += scoreWindow(board[c].slice(r, r + 4), aiPlayer);
			}
		}
		// Fenêtres diagonales /
		for (let c = 0; c < COLS - 3; c++) {
			for (let r = 0; r < ROWS - 3; r++) {
				score += scoreWindow(
					[board[c][r], board[c + 1][r + 1], board[c + 2][r + 2], board[c + 3][r + 3]],
					aiPlayer
				);
			}
		}
		// Fenêtres diagonales \
		for (let c = 3; c < COLS; c++) {
			for (let r = 0; r < ROWS - 3; r++) {
				score += scoreWindow(
					[board[c][r], board[c - 1][r + 1], board[c - 2][r + 2], board[c - 3][r + 3]],
					aiPlayer
				);
			}
		}
		return score;
	},

	isBoardEmpty(board: Board): boolean {
		return board.every((col) => col.every((c) => c === 0));
	},

	countPieces(board: Board, player: number): number {
		return board.reduce((sum, col) => sum + col.filter((c) => c === player).length, 0);
	},
};
