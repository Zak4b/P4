export const XP_PARTIE_JOUEE = 100;
export const XP_VICTOIRE = 400;
export const XP_MATCH_NUL = 150;

/**
 * Formule quadratique pour les niveaux:
 * XP total requis pour atteindre le niveau N = 100 * (1² + 2² + ... + (N-1)²)
 * Soit: 100 * (N-1)*N*(2N-1) / 6
 */
const XP_COEFFICIENT = 100;

/** XP total cumulé pour atteindre le niveau N (exclu) */
function getTotalXpForLevel(level: number): number {
	if (level <= 1) {
		return 0;
	}
	const n = level - 1;
	return (XP_COEFFICIENT * n * (n + 1) * (2 * n + 1)) / 6;
}

export interface LevelInfo {
	level: number;
	xpInCurrentLevel: number;
	xpRequiredForNextLevel: number;
	progressPercent: number;
}

/**
 * Calcule le niveau et la progression à partir de l'XP total.
 * Formule quadratique: niveaux 1, 2, 3... nécessitent 100, 400, 900... XP supplémentaires.
 */
export function getLevelFromXp(totalXp: number): LevelInfo {
	const safeTotalXp = totalXp < 0 ? 0 : totalXp;

	let level = 1;
	while (getTotalXpForLevel(level + 1) <= safeTotalXp) {
		level++;
	}

	const xpAtLevelStart = getTotalXpForLevel(level);
	const xpAtNextLevel = getTotalXpForLevel(level + 1);
	const xpRequiredForNextLevel = xpAtNextLevel - xpAtLevelStart;
	const xpInCurrentLevel = safeTotalXp - xpAtLevelStart;
	const progressPercent =
		xpRequiredForNextLevel > 0 ? Math.min(100, (xpInCurrentLevel / xpRequiredForNextLevel) * 100) : 100;

	return {
		level,
		xpInCurrentLevel,
		xpRequiredForNextLevel,
		progressPercent,
	};
}
