import type { GameEventMap } from "../../realtime/game-events.js";
import type { UserService } from "../user/user.service.js";

// event par joueur
export type AchievementEvent =
	| ({ type: "match:play" } & GameEventMap["match:play"])
	| ({ type: "match:ended"; isWinner: boolean } & GameEventMap["match:ended"]);

export type AchievementEventType = AchievementEvent["type"];

export type UserAchievementStats = NonNullable<Awaited<ReturnType<typeof UserService.getStats>>>;

export type GameAchievementCheck = (event: AchievementEvent) => boolean;
export type UserAchievementCheck = (event: AchievementEvent, stats: UserAchievementStats) => boolean;

export type Achievement =
	| { kind: "game"; id: string; eventType: AchievementEventType; check: GameAchievementCheck }
	| { kind: "user"; id: string; eventType: AchievementEventType; check: UserAchievementCheck };

export function GameAchievement<T extends AchievementEventType>(
	id: string,
	eventType: T,
	check: (event: Extract<AchievementEvent, { type: T }>) => boolean,
): Achievement {
	return { kind: "game", id, eventType, check: check as GameAchievementCheck };
}

export function UserAchievement<T extends AchievementEventType>(
	id: string,
	eventType: T,
	check: (event: Extract<AchievementEvent, { type: T }>, stats: UserAchievementStats) => boolean,
): Achievement {
	return { kind: "user", id, eventType, check: check as UserAchievementCheck };
}
