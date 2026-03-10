import { getBestMove, getBestDrawMove, type Board } from "./minimax.js";

// ── Type de configuration ──────────────────────────────────────────────────────

export type DifficultyConfig = {
	/**
	 * Profondeur de recherche minimax — plus élevée = plus fort mais plus lent.
	 * Plage typique : 2 (facile) → 7 (impossible).
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
	 * Jouer la colonne centrale (col 3) comme tout premier coup sur un plateau vide.
	 * Le centre est statistiquement l'ouverture la plus forte au Puissance 4.
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
	 * Ordre de priorité des colonnes utilisé par le livre d'ouvertures.
	 * Par défaut centré : [3, 2, 4, 1, 5, 0, 6].
	 * Modifier pour ajuster le style d'ouverture (ex. jeu agressif sur les côtés).
	 */
	openingColPriority: readonly number[];

	/**
	 * Bloquer immédiatement une menace de 3-en-ligne de l'adversaire avant
	 * de lancer le minimax, quelle que soit la profondeur. Utile aux niveaux
	 * inférieurs pour éviter les défaites "bêtes".
	 */
	blockImmediateThreats: boolean;

	/**
	 * Délai en millisecondes avant que l'IA envoie son coup.
	 * Purement cosmétique — simule un temps de réflexion.
	 */
	moveDelay: number;

	/**
	 * Mode match nul : l'IA cherche à faire match nul plutôt qu'à gagner.
	 * Elle cible les positions dont le score minimax est le plus proche de 0 (DRAW),
	 * en évitant aussi bien les coups gagnants que les coups perdants.
	 * Quand true, temperature et useOpeningBook sont ignorés.
	 */
	drawMode: boolean;
};

// ── Préréglages de difficulté ──────────────────────────────────────────────────

/** Priorité des colonnes centrée en premier — valeur par défaut pour la plupart des préréglages. */
const CENTER_PRIORITY = [3, 2, 4, 1, 5, 0, 6] as const;

export const DIFFICULTY_PRESETS: Record<string, DifficultyConfig> = {
	/**
	 * Facile — recherche peu profonde, forte aléatoire, pas de livre d'ouvertures.
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
	 * Difficile — recherche profonde, faible aléatoire, livre d'ouvertures sur 2 coups.
	 * Grâce au scoring WIN+depth, l'IA reconnaît et joue les séquences de victoire
	 * forcées (double menaces, zugzwang) même avec une légère part d'aléatoire.
	 */
	hard: {
		depth: 6,
		temperature: 4,
		centerFirst: true,
		useOpeningBook: true,
		openingBookMoves: 2,
		openingColPriority: CENTER_PRIORITY,
		blockImmediateThreats: true,
		moveDelay: 400,
		drawMode: false,
	},

	/**
	 * Impossible — profondeur maximale, meilleur coup déterministe, livre d'ouvertures complet.
	 * Joue toujours le coup optimal et emprunte systématiquement le chemin de victoire
	 * le plus court (WIN+depth). Imbattable avec un jeu correct.
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
	 * Elle utilise getBestDrawMove : parmi les coups non-perdants, elle choisit
	 * celui dont le score minimax est le plus proche de 0 (DRAW), évitant
	 * activement les positions gagnantes comme les positions perdantes.
	 * Ne joue pas le centre en premier ni de livre d'ouvertures (trop agressifs).
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

// ── Utilitaires plateau ────────────────────────────────────────────────────────

function isBoardEmpty(board: Board): boolean {
	return board.every((col) => col.every((c) => c === 0));
}

function isValidCol(board: Board, col: number): boolean {
	return board[col][5] === 0;
}

function countAiPieces(board: Board, aiPlayer: number): number {
	return board.reduce((sum, col) => sum + col.filter((c) => c === aiPlayer).length, 0);
}

// ── Détection de menaces ───────────────────────────────────────────────────────

/**
 * Retourne la première colonne où `player` compléterait un 4-en-ligne
 * en jouant immédiatement, ou null si aucune telle colonne n'existe.
 *
 * Utilisé à la fois pour saisir un coup gagnant et pour bloquer la victoire adverse.
 */
function findWinningMove(board: Board, player: number): number | null {
	const cols = [0, 1, 2, 3, 4, 5, 6].filter((c) => isValidCol(board, c));
	for (const col of cols) {
		const row = board[col].indexOf(0);
		// Placer temporairement la pièce
		board[col][row] = player;
		const wins = checkFourInRow(board, player);
		board[col][row] = 0;
		if (wins) return col;
	}
	return null;
}

function checkFourInRow(board: Board, player: number): boolean {
	// Horizontal
	for (let r = 0; r < 6; r++) {
		for (let c = 0; c < 4; c++) {
			if (board[c][r] === player && board[c+1][r] === player && board[c+2][r] === player && board[c+3][r] === player)
				return true;
		}
	}
	// Vertical
	for (let c = 0; c < 7; c++) {
		for (let r = 0; r < 3; r++) {
			if (board[c][r] === player && board[c][r+1] === player && board[c][r+2] === player && board[c][r+3] === player)
				return true;
		}
	}
	// Diagonale /
	for (let c = 0; c < 4; c++) {
		for (let r = 0; r < 3; r++) {
			if (board[c][r] === player && board[c+1][r+1] === player && board[c+2][r+2] === player && board[c+3][r+3] === player)
				return true;
		}
	}
	// Diagonale \
	for (let c = 3; c < 7; c++) {
		for (let r = 0; r < 3; r++) {
			if (board[c][r] === player && board[c-1][r+1] === player && board[c-2][r+2] === player && board[c-3][r+3] === player)
				return true;
		}
	}
	return false;
}

// ── Livre d'ouvertures ─────────────────────────────────────────────────────────

/**
 * Retourne un coup du livre d'ouvertures pour l'IA, ou null si non applicable.
 *
 * Priorité :
 * 1. Centre en premier — sur un plateau vide, jouer toujours la col 3.
 * 2. Livre d'ouvertures — pour les N premiers coups IA, choisir la colonne
 *    valide la plus prioritaire dans `openingColPriority` (ignore les colonnes pleines).
 */
function openingBookMove(board: Board, aiPlayer: number, config: DifficultyConfig): number | null {
	// 1. Plateau vide → jouer le centre
	if (config.centerFirst && isBoardEmpty(board) && isValidCol(board, 3)) {
		return 3;
	}

	// 2. Livre d'ouvertures pour les premiers coups
	if (!config.useOpeningBook) return null;

	const aiPieces = countAiPieces(board, aiPlayer);
	if (aiPieces >= config.openingBookMoves) return null;

	for (const col of config.openingColPriority) {
		if (isValidCol(board, col)) return col;
	}

	return null;
}

// ── Point d'entrée principal ───────────────────────────────────────────────────

/**
 * Retourne la meilleure colonne pour l'IA selon le plateau actuel et la config de difficulté.
 *
 * Mode normal — ordre de décision :
 * 1. Saisir un coup gagnant immédiat (quelle que soit la difficulté).
 * 2. Bloquer la menace gagnante immédiate de l'adversaire (si blockImmediateThreats).
 * 3. Appliquer le livre d'ouvertures / stratégie centre en premier.
 * 4. Minimax avec scoring WIN+depth (les victoires forcées les plus proches sont prioritaires).
 *
 * Mode match nul (drawMode) — ordre de décision :
 * 1. Bloquer la menace gagnante immédiate de l'adversaire (survie).
 * 2. getBestDrawMove : choisit le coup dont le score est le plus proche de 0 (DRAW),
 *    en évitant activement les positions gagnantes comme perdantes.
 */
export function getMove(board: Board, aiPlayer: 1 | 2, config: DifficultyConfig): number {
	const opp = aiPlayer === 1 ? 2 : 1;

	if (config.drawMode) {
		// En mode match nul, on survit d'abord, puis on cible le DRAW
		if (config.blockImmediateThreats) {
			const blockMove = findWinningMove(board, opp);
			if (blockMove !== null) return blockMove;
		}
		return getBestDrawMove(board, aiPlayer, config.depth);
	}

	// 1. Gagner immédiatement si possible — toujours saisir cette opportunité
	const winMove = findWinningMove(board, aiPlayer);
	if (winMove !== null) return winMove;

	// 2. Bloquer la victoire immédiate de l'adversaire
	if (config.blockImmediateThreats) {
		const blockMove = findWinningMove(board, opp);
		if (blockMove !== null) return blockMove;
	}

	// 3. Livre d'ouvertures / centre en premier
	const bookMove = openingBookMove(board, aiPlayer, config);
	if (bookMove !== null) return bookMove;

	// 4. Minimax (WIN+depth garantit que les séquences forcées sont toujours préférées)
	return getBestMove(board, aiPlayer, config.depth, config.temperature);
}
