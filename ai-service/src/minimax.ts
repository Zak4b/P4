import { WIN, LOSS, DRAW } from "./values.js";
import type { GameEngine, Board } from "./games/GameEngine.js";

export type { Board } from "./games/GameEngine.js";

// ── Utilitaire générique ───────────────────────────────────────────────────────

/**
 * Retourne le premier coup où `player` gagnerait immédiatement, ou null si aucun.
 */
export function findWinningMove(board: Board, player: number, engine: GameEngine): number | null {
	for (const move of engine.getValidMoves(board)) {
		if (engine.checkWinner(engine.applyMove(board, move, player), player)) return move;
	}
	return null;
}

// ── Minimax standard ───────────────────────────────────────────────────────────

function minimax(
	board: Board,
	depth: number,
	alpha: number,
	beta: number,
	maximizing: boolean,
	aiPlayer: number,
	engine: GameEngine
): number {
	const humanPlayer = aiPlayer === 1 ? 2 : 1;
	const validMoves = engine.getValidMoves(board);
	const terminal = engine.isTerminal(board);

	if (depth === 0 || terminal) {
		if (terminal) {
			// WIN + depth : victoire rapide > victoire lointaine
			// LOSS - depth : défaite retardée > défaite immédiate
			if (engine.checkWinner(board, aiPlayer)) return WIN + depth;
			if (engine.checkWinner(board, humanPlayer)) return LOSS - depth;
			return DRAW;
		}
		return engine.evaluate(board, aiPlayer);
	}

	if (maximizing) {
		let value = -Infinity;
		for (const move of validMoves) {
			const newBoard = engine.applyMove(board, move, aiPlayer);
			value = Math.max(value, minimax(newBoard, depth - 1, alpha, beta, false, aiPlayer, engine));
			alpha = Math.max(alpha, value);
			if (alpha >= beta) break;
		}
		return value;
	} else {
		let value = Infinity;
		for (const move of validMoves) {
			const newBoard = engine.applyMove(board, move, humanPlayer);
			value = Math.min(value, minimax(newBoard, depth - 1, alpha, beta, true, aiPlayer, engine));
			beta = Math.min(beta, value);
			if (alpha >= beta) break;
		}
		return value;
	}
}

/**
 * temperature = 0  → toujours le meilleur coup (déterministe)
 * temperature > 0  → sélection softmax : plus T est grand, plus les coups sont aléatoires.
 */
export function getBestMove(
	board: Board,
	aiPlayer: 1 | 2,
	engine: GameEngine,
	depth: number = 6,
	temperature: number = 0
): number {
	const validMoves = engine.getValidMoves(board);

	const scored = validMoves.map((move) => ({
		move,
		score: minimax(engine.applyMove(board, move, aiPlayer), depth - 1, -Infinity, Infinity, false, aiPlayer, engine),
	}));

	if (temperature === 0) {
		return scored.reduce((best, m) => (m.score > best.score ? m : best)).move;
	}

	const maxScore = Math.max(...scored.map((m) => m.score));
	const expScores = scored.map((m) => Math.exp((m.score - maxScore) / temperature));
	const total = expScores.reduce((a, b) => a + b, 0);

	let rand = Math.random() * total;
	for (let i = 0; i < expScores.length; i++) {
		rand -= expScores[i];
		if (rand <= 0) return scored[i].move;
	}
	return scored[scored.length - 1].move;
}

// ── Minimax dédié au mode match nul ───────────────────────────────────────────

/**
 * Variante de minimax pour l'IA "match nul".
 *
 * Échelle des valeurs terminales (du point de vue de l'IA draw) :
 *   WIN + depth  → match nul : objectif principal, plus tôt = mieux
 *   LOSS / 2     → victoire de l'IA : non souhaitée (pénalité modérée)
 *   LOSS - depth → victoire de l'adversaire : pire résultat, retarder au maximum
 *
 * Évaluation heuristique (depth = 0, position non terminale) :
 *   On minimise le déséquilibre : -(|score_IA - score_adversaire|)
 */
function minimaxDraw(
	board: Board,
	depth: number,
	alpha: number,
	beta: number,
	maximizing: boolean,
	aiPlayer: number,
	engine: GameEngine
): number {
	const humanPlayer = aiPlayer === 1 ? 2 : 1;
	const validMoves = engine.getValidMoves(board);
	const terminal = engine.isTerminal(board);

	if (depth === 0 || terminal) {
		if (terminal) {
			if (engine.checkWinner(board, humanPlayer)) return LOSS - depth; // défaite : pire résultat
			if (engine.checkWinner(board, aiPlayer)) return LOSS / 2;        // victoire IA : non souhaitée
			return WIN + depth;                                               // match nul : objectif !
		}
		return -(Math.abs(engine.evaluate(board, aiPlayer) - engine.evaluate(board, humanPlayer)));
	}

	if (maximizing) {
		let value = -Infinity;
		for (const move of validMoves) {
			const newBoard = engine.applyMove(board, move, aiPlayer);
			value = Math.max(value, minimaxDraw(newBoard, depth - 1, alpha, beta, false, aiPlayer, engine));
			alpha = Math.max(alpha, value);
			if (alpha >= beta) break;
		}
		return value;
	} else {
		let value = Infinity;
		for (const move of validMoves) {
			const newBoard = engine.applyMove(board, move, humanPlayer);
			value = Math.min(value, minimaxDraw(newBoard, depth - 1, alpha, beta, true, aiPlayer, engine));
			beta = Math.min(beta, value);
			if (alpha >= beta) break;
		}
		return value;
	}
}

/**
 * Retourne le coup qui maximise les chances de match nul.
 */
export function getBestDrawMove(
	board: Board,
	aiPlayer: 1 | 2,
	engine: GameEngine,
	depth: number = 6
): number {
	const validMoves = engine.getValidMoves(board);

	const scored = validMoves.map((move) => ({
		move,
		score: minimaxDraw(engine.applyMove(board, move, aiPlayer), depth - 1, -Infinity, Infinity, false, aiPlayer, engine),
	}));

	return scored.reduce((best, m) => (m.score > best.score ? m : best)).move;
}
