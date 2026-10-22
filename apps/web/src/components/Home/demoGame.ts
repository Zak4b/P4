import { BOARD_ROWS, getCell, type Board, type TokenColor } from "@/store/game";
import { createEmptyBoard, setCell } from "@/store/game/utils";

/**
 * Parties rejouées en boucle sur la page d'accueil. Une partie est la suite
 * des colonnes jouées, rouge commence, et s'arrête exactement sur le coup
 * gagnant (à revérifier si l'on en ajoute une).
 */
export type Scenario = number[];

export const SCENARIOS: Scenario[] = [
	// Ligne et diagonale : le rouge menace en colonnes 0 et 2, le jaune ne peut bloquer qu'une case.
	[3, 4, 4, 3, 3, 4, 4, 3, 1, 4, 2, 0, 2],
	// Trois ouverts aux deux bouts : le jaune aligne la deuxième rangée, le rouge ne ferme qu'un côté.
	[2, 1, 3, 3, 4, 5, 3, 4, 3, 2, 1, 5],
	// Partie disputée au centre : le rouge finit par tenir deux diagonales, en colonnes 2 et 6.
	[3, 2, 2, 3, 3, 2, 3, 3, 2, 4, 4, 5, 4, 4, 5, 2, 6],
	// Menaces superposées : en bloquant le jaune en colonne 4, le rouge lui offre la case du dessus.
	[2, 3, 3, 3, 2, 2, 3, 2, 2, 5, 5, 6, 4, 4],
];

/** Rangée où tomberait un jeton dans la colonne `x`, ou `null` si elle est pleine. */
function landingY(board: Board, x: number): number | null {
	for (let y = 0; y < BOARD_ROWS; y++) {
		if (getCell(board, x, y) === "empty") {
			return y;
		}
	}
	return null;
}

/** Plateau après les `count` premiers coups d'un scénario, avec la position du dernier. */
export function replay(moves: number[], count: number): { board: Board; lastMove: { x: number; y: number } | null } {
	const board = createEmptyBoard();
	let lastMove: { x: number; y: number } | null = null;
	moves.slice(0, count).forEach((x, i) => {
		const y = landingY(board, x);
		if (y === null) {
			return;
		}
		const color: TokenColor = i % 2 === 0 ? "player1" : "player2";
		setCell(board, x, y, color);
		lastMove = { x, y };
	});
	return { board, lastMove };
}
