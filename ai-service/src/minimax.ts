import {
	WIN,
	LOSS,
	DRAW,
	WINDOW_4_AI,
	WINDOW_3_AI,
	WINDOW_2_AI,
	WINDOW_3_OPP,
	CENTER_COLUMN_BONUS,
} from "./values.js";

export type Board = number[][];

// 0 = empty, 1 = player 1, 2 = player 2
// On vérifie que la colonne du haut n'est pas remplie (index 5) pour valider un coup
// Les pièces tombent dans la première case vide de la colonne (index 0 à 5)
function isValidMove(board: Board, col: number): boolean {
	return board[col][5] === 0;
}

// Simule le placement d'une pièce pour un joueur donné, en retournant une nouvelle board
function dropPiece(board: Board, col: number, player: number): Board {
	const newBoard = board.map((c) => [...c]);
	const row = newBoard[col].indexOf(0);
	newBoard[col][row] = player;
	return newBoard;
}

// Vérifie si un joueur a gagné en alignant 4 pièces horizontalement, verticalement ou diagonalement
function checkWinner(board: Board, player: number): boolean {
	// Horizontal
	for (let r = 0; r < 6; r++) {
		for (let c = 0; c < 4; c++) {
			if (
				board[c][r] === player &&
				board[c + 1][r] === player &&
				board[c + 2][r] === player &&
				board[c + 3][r] === player
			)
				return true;
		}
	}
	// Vertical
	for (let c = 0; c < 7; c++) {
		for (let r = 0; r < 3; r++) {
			if (
				board[c][r] === player &&
				board[c][r + 1] === player &&
				board[c][r + 2] === player &&
				board[c][r + 3] === player
			)
				return true;
		}
	}
	// Diagonal /
	for (let c = 0; c < 4; c++) {
		for (let r = 0; r < 3; r++) {
			if (
				board[c][r] === player &&
				board[c + 1][r + 1] === player &&
				board[c + 2][r + 2] === player &&
				board[c + 3][r + 3] === player
			)
				return true;
		}
	}
	// Diagonal \
	for (let c = 3; c < 7; c++) {
		for (let r = 0; r < 3; r++) {
			if (
				board[c][r] === player &&
				board[c - 1][r + 1] === player &&
				board[c - 2][r + 2] === player &&
				board[c - 3][r + 3] === player
			)
				return true;
		}
	}
	return false;
}

// Check si la partie est terminée : victoire de l'un des joueurs ou match nul (toutes les colonnes remplies)
// Utiliser pour le minimax : si terminal, on retourne une évaluation de la position (gagnant, perdant, ou score heuristique)
function isTerminal(board: Board): boolean {
	return (
		checkWinner(board, 1) ||
		checkWinner(board, 2) ||
		board.every((col) => col[5] !== 0)
	);
}

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

function scorePosition(board: Board, player: number): number {
	let score = 0;
	score += board[3].filter((c) => c === player).length * CENTER_COLUMN_BONUS;
	for (let r = 0; r < 6; r++) {
		const row = board.map((col) => col[r]);
		for (let c = 0; c < 4; c++) {
			score += scoreWindow(row.slice(c, c + 4), player);
		}
	}
	for (let c = 0; c < 7; c++) {
		for (let r = 0; r < 3; r++) {
			score += scoreWindow(board[c].slice(r, r + 4), player);
		}
	}
	for (let c = 0; c < 4; c++) {
		for (let r = 0; r < 3; r++) {
			score += scoreWindow(
				[board[c][r], board[c + 1][r + 1], board[c + 2][r + 2], board[c + 3][r + 3]],
				player
			);
		}
	}
	for (let c = 3; c < 7; c++) {
		for (let r = 0; r < 3; r++) {
			score += scoreWindow(
				[board[c][r], board[c - 1][r + 1], board[c - 2][r + 2], board[c - 3][r + 3]],
				player
			);
		}
	}
	return score;
}

function minimax(
	board: Board,
	depth: number,
	alpha: number,
	beta: number,
	maximizing: boolean,
	aiPlayer: number
): number {
	const humanPlayer = aiPlayer === 1 ? 2 : 1;
	const validCols = [0, 1, 2, 3, 4, 5, 6].filter((c) => isValidMove(board, c));
	const terminal = isTerminal(board);

	if (depth === 0 || terminal) {
		if (terminal) {
			// WIN + depth : victoire rapide > victoire lointaine (chemin forcé privilégié)
			// LOSS - depth : défaite retardée > défaite immédiate (survie maximale)
			if (checkWinner(board, aiPlayer)) return WIN + depth;
			if (checkWinner(board, humanPlayer)) return LOSS - depth;
			return DRAW;
		}
		return scorePosition(board, aiPlayer);
	}

	if (maximizing) {
		let value = -Infinity;
		for (const col of validCols) {
			const newBoard = dropPiece(board, col, aiPlayer);
			value = Math.max(value, minimax(newBoard, depth - 1, alpha, beta, false, aiPlayer));
			alpha = Math.max(alpha, value);
			if (alpha >= beta) break;
		}
		return value;
	} else {
		let value = Infinity;
		for (const col of validCols) {
			const newBoard = dropPiece(board, col, humanPlayer);
			value = Math.min(value, minimax(newBoard, depth - 1, alpha, beta, true, aiPlayer));
			beta = Math.min(beta, value);
			if (alpha >= beta) break;
		}
		return value;
	}
}

/**
 * temperature = 0  → toujours le meilleur coup (Impossible)
 * temperature > 0  → sélection softmax : plus T est grand, plus les coups sont aléatoires.
 * Les scores WIN+depth garantissent que les victoires forcées (les plus proches) sont
 * astronomiquement plus probables même à haute température.
 */
export function getBestMove(board: Board, aiPlayer: 1 | 2, depth: number = 6, temperature: number = 0): number {
	const validCols = [0, 1, 2, 3, 4, 5, 6].filter((c) => isValidMove(board, c));

	// Compute minimax score for each valid move
	const scored = validCols.map((col) => ({
		col,
		score: minimax(dropPiece(board, col, aiPlayer), depth - 1, -Infinity, Infinity, false, aiPlayer),
	}));

	// temperature=0 → deterministic best move (Impossible)
	if (temperature === 0) {
		return scored.reduce((best, m) => (m.score > best.score ? m : best)).col;
	}

	// Softmax sampling: normalize by max score for numerical stability
	const maxScore = Math.max(...scored.map((m) => m.score));
	const expScores = scored.map((m) => Math.exp((m.score - maxScore) / temperature));
	const total = expScores.reduce((a, b) => a + b, 0);

	let rand = Math.random() * total;
	for (let i = 0; i < expScores.length; i++) {
		rand -= expScores[i];
		if (rand <= 0) return scored[i].col;
	}
	return scored[scored.length - 1].col;
}

// ── Minimax dédié au mode match nul ───────────────────────────────────────────

/**
 * Variante de minimax pour l'IA "match nul".
 *
 * Échelle des valeurs terminales (du point de vue de l'IA draw) :
 *   WIN + depth  → match nul (board plein) : objectif principal, plus tôt = mieux
 *   LOSS / 2     → victoire de l'IA : non souhaitée (pénalité modérée)
 *   LOSS - depth → victoire de l'adversaire : pire résultat, retarder au maximum
 *
 * Évaluation heuristique (depth = 0, position non terminale) :
 *   On minimise le déséquilibre : -(|score_IA - score_adversaire|)
 *   Une position parfaitement équilibrée retourne 0 (idéal pour le match nul).
 *
 * L'IA maximise ce score ; l'adversaire le minimise (joue pour gagner normalement).
 */
function minimaxDraw(
	board: Board,
	depth: number,
	alpha: number,
	beta: number,
	maximizing: boolean,
	aiPlayer: number
): number {
	const humanPlayer = aiPlayer === 1 ? 2 : 1;
	const validCols = [0, 1, 2, 3, 4, 5, 6].filter((c) => isValidMove(board, c));
	const terminal = isTerminal(board);

	if (depth === 0 || terminal) {
		if (terminal) {
			if (checkWinner(board, humanPlayer)) return LOSS - depth; // défaite : pire résultat
			if (checkWinner(board, aiPlayer))    return LOSS / 2;     // victoire IA : non souhaitée
			return WIN + depth;                                        // match nul : objectif !
		}
		// Heuristique : position équilibrée (différence minimale) = meilleure pour le match nul
		return -(Math.abs(scorePosition(board, aiPlayer) - scorePosition(board, humanPlayer)));
	}

	if (maximizing) {
		let value = -Infinity;
		for (const col of validCols) {
			const newBoard = dropPiece(board, col, aiPlayer);
			value = Math.max(value, minimaxDraw(newBoard, depth - 1, alpha, beta, false, aiPlayer));
			alpha = Math.max(alpha, value);
			if (alpha >= beta) break;
		}
		return value;
	} else {
		let value = Infinity;
		for (const col of validCols) {
			const newBoard = dropPiece(board, col, humanPlayer);
			value = Math.min(value, minimaxDraw(newBoard, depth - 1, alpha, beta, true, aiPlayer));
			beta = Math.min(beta, value);
			if (alpha >= beta) break;
		}
		return value;
	}
}

/**
 * Retourne le coup qui maximise les chances de match nul.
 * Utilise minimaxDraw où DRAW terminal est le score le plus élevé possible.
 */
export function getBestDrawMove(board: Board, aiPlayer: 1 | 2, depth: number = 6): number {
	const validCols = [0, 1, 2, 3, 4, 5, 6].filter((c) => isValidMove(board, c));

	const scored = validCols.map((col) => ({
		col,
		score: minimaxDraw(dropPiece(board, col, aiPlayer), depth - 1, -Infinity, Infinity, false, aiPlayer),
	}));

	return scored.reduce((best, m) => (m.score > best.score ? m : best)).col;
}
