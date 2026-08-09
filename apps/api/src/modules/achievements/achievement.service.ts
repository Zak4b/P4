import { logger } from "../../lib/logger.js";
import { gameEvents } from "../../realtime/game-events.js";
import { UserService } from "../user/user.service.js";
import { achievementEvents } from "./achievement-events.js";
import { achievementRegistry } from "./achievement.registry.js";
import type { Achievement, AchievementEvent, UserAchievementStats } from "./achievement.js";

function checkOne(achievement: Achievement, event: AchievementEvent, stats: UserAchievementStats | null): boolean {
	if (achievement.kind === "game") {
		return achievement.check(event);
	}
	return stats !== null && achievement.check(event, stats);
}

async function evaluate(uuid: string, event: AchievementEvent): Promise<void> {
	const candidates = achievementRegistry.getByEvent(event.type);
	if (candidates.length === 0) {
		return;
	}

	const needsStats = candidates.some((achievement) => achievement.kind === "user");
	const stats = needsStats ? await UserService.getStats(uuid) : null;

	for (const achievement of candidates) {
		if (checkOne(achievement, event, stats)) {
			achievementEvents.emit("unlocked", { uuid, achievementId: achievement.id });
		}
	}
}

function evaluateSafe(uuid: string, event: AchievementEvent): void {
	evaluate(uuid, event).catch((error: unknown) => {
		logger.error({ err: error, uuid, eventType: event.type }, "Failed to evaluate achievements");
	});
}

gameEvents.on("match:play", (data) => {
	evaluateSafe(data.player.uuid, { type: "match:play", ...data });
});

gameEvents.on("match:ended", (data) => {
	for (const player of data.registeredPlayers) {
		const isWinner = player.uuid === data.winnerUuid;
		evaluateSafe(player.uuid, { type: "match:ended", ...data, isWinner });
	}
});

//TODO
achievementEvents.on("unlocked", ({ uuid, achievementId }) => {
	logger.info({ uuid, achievementId }, "Achievement unlocked");
});
