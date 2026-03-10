export type Board = number[][];

/**
 * Interface que tout moteur de jeu doit implémenter pour fonctionner avec l'IA générique.
 * Les coups sont représentés par des nombres (ex. index de colonne pour Puissance 4).
 */
export interface GameEngine {
	/** Crée un plateau vide initial. */
	createBoard(): Board;

	/** Retourne tous les coups valides pour l'état actuel du plateau. */
	getValidMoves(board: Board): number[];

	/** Applique un coup pour un joueur et retourne le nouveau plateau (immutable). */
	applyMove(board: Board, move: number, player: number): Board;

	/** Vérifie si un joueur donné a gagné. */
	checkWinner(board: Board, player: number): boolean;

	/** Vérifie si la partie est terminée (victoire ou match nul). */
	isTerminal(board: Board): boolean;

	/** Évaluation heuristique d'une position du point de vue de aiPlayer. */
	evaluate(board: Board, aiPlayer: number): number;

	/** Vérifie si le plateau est complètement vide (utilisé par le livre d'ouvertures). */
	isBoardEmpty(board: Board): boolean;

	/** Compte le nombre de pièces d'un joueur donné sur le plateau. */
	countPieces(board: Board, player: number): number;
}
