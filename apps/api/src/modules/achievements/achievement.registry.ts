import { logger } from "../../lib/logger.js";
import { GameAchievement, UserAchievement, type Achievement, type AchievementEventType } from "./achievement.js";

function MatchCount(id: string, bound: number): Achievement {
	return UserAchievement(id, "match:ended", (_, stats) => stats.totalGames >= bound);
}

function WinCount(id: string, bound: number): Achievement {
	return UserAchievement(id, "match:ended", (_, stats) => stats.wins >= bound);
}

function WinRatio(id: string, min_count: number, bound: number): Achievement {
	return UserAchievement(
		id,
		"match:ended",
		(_, stats) => stats.totalGames >= min_count && stats.wins / stats.totalGames >= bound,
	);
}

class AchievementRegistry {
	private readonly byEvent: Record<AchievementEventType, Achievement[]> = {
		"match:play": [],
		"match:ended": [],
	};

	constructor(achievements: Achievement[]) {
		const seenIds = new Set<string>();
		for (const achievement of achievements) {
			if (seenIds.has(achievement.id)) {
				logger.warn({ achievementId: achievement.id }, "Duplicate achievement ID in registry");
				continue;
			}
			seenIds.add(achievement.id);
			this.byEvent[achievement.eventType].push(achievement);
		}
	}

	getByEvent(eventType: AchievementEventType): Achievement[] {
		return this.byEvent[eventType];
	}
}

export const achievementRegistry = new AchievementRegistry([
	GameAchievement("speedrunner", "match:ended", (event) => event.isWinner && event.turnCount <= 8),
	GameAchievement("blind", "match:ended", (event) => event.isWinner === false && event.turnCount <= 8),
	GameAchievement("blitz", "match:ended", (event) => event.isWinner && event.duration <= 30),
	// - 7x6 = 42
	GameAchievement("deadlock", "match:ended", (event) => event.winnerUuid === null && event.turnCount === 42),
	GameAchievement("inevitable", "match:ended", (event) => event.isWinner && event.turnCount === 42),

	WinCount("first_win", 1),
	WinCount("strategist", 30),
	WinCount("champion", 50),
	WinCount("conqueror", 100),
	WinCount("master", 200),
	//WinCount("legend", 300),

	MatchCount("rookie", 10),
	MatchCount("regular", 50),
	MatchCount("veteran", 100),

	WinRatio("ace", 10, 0.6),
	WinRatio("predator", 25, 0.75),

	UserAchievement("pacifist", "match:ended", (_event, stats) => stats.draws >= 100),
]);
