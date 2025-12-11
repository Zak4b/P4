import { prisma } from "./prisma";
import { GameWinner } from "@prisma/client";

const K_FACTOR = 32;
const INITIAL_ELO = 1000;

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
 * @returns Nouveau rating
 */
function calculateNewRating(
	currentRating: number,
	actualScore: number,
	expectedScore: number,
	kFactor: number = K_FACTOR
): number {
	const ratingChange = kFactor * (actualScore - expectedScore);
	return Math.round(currentRating + ratingChange);
}

export async function getPlayerElo(playerId: string): Promise<number> {
	const user = await prisma.user.findUnique({
		where: { id: playerId },
		select: { eloRating: true },
	});
	if (!user) {
		throw new Error(`User with id ${playerId} not found`);
	}
	return user.eloRating;
}

/**
 * Calcule les nouveaux scores ELO après une partie
 * @param player1Elo - Score ELO actuel du joueur 1
 * @param player2Elo - Score ELO actuel du joueur 2
 * @param winner - Gagnant de la partie (PLAYER1, PLAYER2, ou DRAW)
 * @returns Tuple contenant [nouveauEloJoueur1, nouveauEloJoueur2]
 */
export function calculateNewElo(
	player1Elo: number,
	player2Elo: number,
	winner: GameWinner
): [number, number] {
	// Déterminer les scores réels
	let player1ActualScore: number;
	let player2ActualScore: number;

	switch (winner) {
		case GameWinner.PLAYER1:
			player1ActualScore = 1; // Victoire
			player2ActualScore = 0; // Défaite
			break;
		case GameWinner.PLAYER2:
			player1ActualScore = 0; // Défaite
			player2ActualScore = 1; // Victoire
			break;
		case GameWinner.DRAW:
		default:
			player1ActualScore = 0.5; // Match nul
			player2ActualScore = 0.5; // Match nul
			break;
	}

	// Calculer les scores attendus
	const player1ExpectedScore = calculateExpectedScore(player1Elo, player2Elo);
	const player2ExpectedScore = calculateExpectedScore(player2Elo, player1Elo);

	// Calculer les nouveaux ratings
	const newPlayer1Elo = calculateNewRating(player1Elo, player1ActualScore, player1ExpectedScore);
	const newPlayer2Elo = calculateNewRating(player2Elo, player2ActualScore, player2ExpectedScore);

	return [newPlayer1Elo, newPlayer2Elo];
}

export async function updatePlayerElos(
	player1Id: string,
	player2Id: string,
	winner: GameWinner
): Promise<[number, number]> {
	const player1Elo = await getPlayerElo(player1Id);
	const player2Elo = await getPlayerElo(player2Id);

	const [newPlayer1Elo, newPlayer2Elo] = calculateNewElo(player1Elo, player2Elo, winner);

	await prisma.$transaction([
		prisma.user.update({
			where: { id: player1Id },
			data: { eloRating: newPlayer1Elo },
		}),
		prisma.user.update({
			where: { id: player2Id },
			data: { eloRating: newPlayer2Elo },
		}),
	]);
	return [newPlayer1Elo, newPlayer2Elo];
}
