import { GameWinner } from "@prisma/client";

export const XP_PARTIE_JOUEE = 10;
export const XP_VICTOIRE = 40;
export const XP_MATCH_NUL = 15;

export function calculateXpGain(winner: GameWinner, isPlayer1: boolean): number {
	let xp = XP_PARTIE_JOUEE;

	if (winner === GameWinner.DRAW) {
		xp += XP_MATCH_NUL;
	} else if ((winner === GameWinner.PLAYER1 && isPlayer1) || (winner === GameWinner.PLAYER2 && !isPlayer1)) {
		xp += XP_VICTOIRE;
	}

	return xp;
}

/**
 * Formule quadratique pour les niveaux:
 * XP total requis pour atteindre le niveau N = 100 * (1² + 2² + ... + (N-1)²)
 * Soit: 100 * (N-1)*N*(2N-1) / 6
 */
const XP_COEFFICIENT = 100;

/** XP total cumulé pour atteindre le niveau N (exclu) */
function getTotalXpForLevel(level: number): number {
	if (level <= 1) return 0;
	const n = level - 1;
	return (XP_COEFFICIENT * n * (n + 1) * (2 * n + 1)) / 6;
}

/**
 * Calcule le niveau et la progression à partir de l'XP total.
 * Formule quadratique: niveaux 1, 2, 3... nécessitent 100, 400, 900... XP supplémentaires.
 */
export function getLevelFromXp(totalXp: number): {
	level: number;
	xpInCurrentLevel: number;
	xpRequiredForNextLevel: number;
	progressPercent: number;
} {
	if (totalXp < 0) totalXp = 0;

	let level = 1;
	while (getTotalXpForLevel(level + 1) <= totalXp) {
		level++;
	}

	const xpAtLevelStart = getTotalXpForLevel(level);
	const xpAtNextLevel = getTotalXpForLevel(level + 1);
	const xpRequiredForNextLevel = xpAtNextLevel - xpAtLevelStart;
	const xpInCurrentLevel = totalXp - xpAtLevelStart;
	const progressPercent = xpRequiredForNextLevel > 0 ? Math.min(100, (xpInCurrentLevel / xpRequiredForNextLevel) * 100) : 100;

	return {
		level,
		xpInCurrentLevel,
		xpRequiredForNextLevel,
		progressPercent,
	};
}
