import { getBestMove, getBestDrawMove, findWinningMove, type Board } from "./minimax.js";
import type { GameEngine } from "./games/GameEngine.js";

// ── Type de configuration ──────────────────────────────────────────────────────

export type DifficultyConfig = {
	/**
	 * Profondeur de recherche minimax — plus élevée = plus fort mais plus lent.
	 * Plage typique : 1 (facile) → 7 (impossible).
	 */
	depth: number;

	/**
	 * Température softmax pour la sélection des coups.
	 * 0 = toujours le meilleur coup (déterministe), plus élevée = plus aléatoire.
	 * Plage typique : 0 (impossible) → 80 (facile).
	 * Ignoré si drawMode est true.
	 */
	temperature: number;

	/**
	 * Jouer le coup central comme tout premier coup sur un plateau vide.
	 * Pour Puissance 4, le centre est statistiquement l'ouverture la plus forte.
	 * La notion de "centre" est définie par openingColPriority[0].
	 */
	centerFirst: boolean;

	/**
	 * Utiliser un livre d'ouvertures prédéfini pour les N premiers coups de l'IA
	 * au lieu du minimax. Économise du calcul sur les positions optimales connues.
	 */
	useOpeningBook: boolean;

	/**
	 * Nombre de coups IA (compte indexé à 0 des pièces déjà placées par l'IA)
	 * couverts par le livre d'ouvertures. Ignoré si useOpeningBook est false.
	 */
	openingBookMoves: number;

	/**
	 * Ordre de priorité des coups utilisé par le livre d'ouvertures.
	 * Pour Puissance 4 : [3, 2, 4, 1, 5, 0, 6] (centré).
	 * Adapter selon le jeu et le style d'ouverture souhaité.
	 */
	openingColPriority: readonly number[];

	/**
	 * Bloquer immédiatement un coup gagnant de l'adversaire avant de lancer
	 * le minimax, quelle que soit la profondeur.
	 */
	blockImmediateThreats: boolean;

	/**
	 * Délai en millisecondes avant que l'IA envoie son coup.
	 * Purement cosmétique — simule un temps de réflexion.
	 */
	moveDelay: number;

	/**
	 * Mode match nul : l'IA cherche à faire match nul plutôt qu'à gagner.
	 * Quand true, temperature et useOpeningBook sont ignorés.
	 */
	drawMode: boolean;
};

// ── Préréglages de difficulté ──────────────────────────────────────────────────

/** Priorité des colonnes centrée en premier — valeur par défaut pour Puissance 4. */
const CENTER_PRIORITY = [3, 2, 4, 1, 5, 0, 6] as const;

export const DIFFICULTY_PRESETS: Record<string, DifficultyConfig> = {
	/**
	 * Facile — recherche peu profonde, très aléatoire, pas de livre d'ouvertures.
	 * Fait souvent des erreurs et ignore les menaces.
	 */
	easy: {
		depth: 1,
		temperature: 80,
		centerFirst: false,
		useOpeningBook: false,
		openingBookMoves: 0,
		openingColPriority: CENTER_PRIORITY,
		blockImmediateThreats: false,
		moveDelay: 400,
		drawMode: false,
	},

	/**
	 * Moyen — profondeur modérée, un peu d'aléatoire, joue le centre en premier.
	 * Rate parfois les menaces en plusieurs coups mais se défend globalement bien.
	 */
	medium: {
		depth: 4,
		temperature: 25,
		centerFirst: true,
		useOpeningBook: false,
		openingBookMoves: 0,
		openingColPriority: CENTER_PRIORITY,
		blockImmediateThreats: true,
		moveDelay: 400,
		drawMode: false,
	},

	/**
	 * Difficile — recherche profonde, faible aléatoire, livre d'ouvertures sur 3 coups.
	 */
	hard: {
		depth: 6,
		temperature: 4,
		centerFirst: true,
		useOpeningBook: true,
		openingBookMoves: 3,
		openingColPriority: CENTER_PRIORITY,
		blockImmediateThreats: true,
		moveDelay: 400,
		drawMode: false,
	},

	/**
	 * Impossible — profondeur maximale, meilleur coup déterministe, livre d'ouvertures complet.
	 */
	impossible: {
		depth: 7,
		temperature: 0,
		centerFirst: true,
		useOpeningBook: true,
		openingBookMoves: 4,
		openingColPriority: CENTER_PRIORITY,
		blockImmediateThreats: true,
		moveDelay: 400,
		drawMode: false,
	},

	/**
	 * Match nul — l'IA essaie à tout prix de faire match nul.
	 */
	draw: {
		depth: 6,
		temperature: 0,
		centerFirst: false,
		useOpeningBook: false,
		openingBookMoves: 0,
		openingColPriority: CENTER_PRIORITY,
		blockImmediateThreats: true,
		moveDelay: 400,
		drawMode: true,
	},
};

export const DEFAULT_DIFFICULTY: keyof typeof DIFFICULTY_PRESETS = "hard";

// ── Livre d'ouvertures ─────────────────────────────────────────────────────────

/**
 * Retourne un coup du livre d'ouvertures pour l'IA, ou null si non applicable.
 *
 * Priorité :
 * 1. Centre en premier — sur un plateau vide, jouer le premier coup de openingColPriority.
 * 2. Livre d'ouvertures — pour les N premiers coups IA, choisir le coup valide
 *    le plus prioritaire dans openingColPriority.
 */
function openingBookMove(board: Board, aiPlayer: number, config: DifficultyConfig, engine: GameEngine): number | null {
	const validMoves = engine.getValidMoves(board);

	// 1. Plateau vide → jouer le premier coup de la priorité d'ouverture
	if (config.centerFirst && engine.isBoardEmpty(board)) {
		const centerMove = config.openingColPriority.find((m) => validMoves.includes(m));
		if (centerMove !== undefined) return centerMove;
	}

	// 2. Livre d'ouvertures pour les premiers coups
	if (!config.useOpeningBook) return null;

	const aiPieces = engine.countPieces(board, aiPlayer);
	if (aiPieces >= config.openingBookMoves) return null;

	for (const move of config.openingColPriority) {
		if (validMoves.includes(move)) return move;
	}

	return null;
}

// ── Point d'entrée principal ───────────────────────────────────────────────────

/**
 * Retourne le meilleur coup pour l'IA selon le plateau actuel, la config et le moteur de jeu.
 *
 * Mode normal — ordre de décision :
 * 1. Saisir un coup gagnant immédiat.
 * 2. Bloquer le coup gagnant immédiat de l'adversaire (si blockImmediateThreats).
 * 3. Appliquer le livre d'ouvertures / stratégie centre en premier.
 * 4. Minimax avec scoring WIN+depth.
 *
 * Mode match nul (drawMode) — ordre de décision :
 * 1. Bloquer le coup gagnant immédiat de l'adversaire (survie).
 * 2. getBestDrawMove : cible le DRAW en évitant les positions gagnantes et perdantes.
 */
export function getMove(board: Board, aiPlayer: 1 | 2, config: DifficultyConfig, engine: GameEngine): number {
	const opp = aiPlayer === 1 ? 2 : 1;

	if (config.drawMode) {
		if (config.blockImmediateThreats) {
			const blockMove = findWinningMove(board, opp, engine);
			if (blockMove !== null) return blockMove;
		}
		return getBestDrawMove(board, aiPlayer, engine, config.depth);
	}

	// 1. Gagner immédiatement si possible
	const winMove = findWinningMove(board, aiPlayer, engine);
	if (winMove !== null) return winMove;

	// 2. Bloquer la victoire immédiate de l'adversaire
	if (config.blockImmediateThreats) {
		const blockMove = findWinningMove(board, opp, engine);
		if (blockMove !== null) return blockMove;
	}

	// 3. Livre d'ouvertures / centre en premier
	const bookMove = openingBookMove(board, aiPlayer, config, engine);
	if (bookMove !== null) return bookMove;

	// 4. Minimax
	return getBestMove(board, aiPlayer, engine, config.depth, config.temperature);
}
