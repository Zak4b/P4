import { GameWinner } from "@prisma/client";

const K_FACTOR = 32;

/**
 * Calcule le score attendu (expected score) pour un joueur
 * Formule ELO standard: E_A = 1 / (1 + 10^((R_B - R_A) / 400))
 * @param playerRating - Rating du joueur
 * @param opponentRating - Rating de l'adversaire
 * @returns Score attendu entre 0 et 1
 */
function calculateExpectedScore(playerRating: number, opponentRating: number): number {
	const ratingDiff = opponentRating - playerRating;
	return 1 / (1 + Math.pow(10, ratingDiff / 400));
}

/**
 * Formule ELO standard: R'_A = R_A + K * (S_A - E_A)
 * @param currentRating - Rating actuel du joueur
 * @param actualScore - Score réel (1 pour victoire, 0.5 pour match nul, 0 pour défaite)
 * @param expectedScore - Score attendu
 * @param kFactor - Facteur K (par défaut: 32)
 * @returns rating delta
 */
function calculateDelta(
	currentRating: number,
	actualScore: number,
	expectedScore: number,
	kFactor: number = K_FACTOR
): number {
	const ratingChange = kFactor * (actualScore - expectedScore);
	return Math.round(ratingChange);
}

/**
 * Calcule les nouveaux scores ELO après une partie
 * @param player1Elo - Score ELO actuel du joueur 1
 * @param player2Elo - Score ELO actuel du joueur 2
 * @param winner - Gagnant de la partie (PLAYER1, PLAYER2, ou DRAW)
 */
export function calculateNewElo(
	player1Elo: number,
	player2Elo: number,
	winner: GameWinner
): { 1: number, 2: number, delta1: number, delta2: number } {

	let score: number;
	if (winner === GameWinner.PLAYER1) {
		score = 1;
	} else if (winner === GameWinner.PLAYER2) {
		score = 0;
	} else {
		score = 0.5;
	}

	const expectedScore = calculateExpectedScore(player1Elo, player2Elo);

	const delta = calculateDelta(player1Elo, score, expectedScore);

	return { 1: player1Elo + delta, 2: player2Elo - delta, delta1: delta, delta2: -delta };
}
