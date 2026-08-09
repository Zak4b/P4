import { TypedEventEmitter } from "../../game-engine/typed-event-emitter.js";

export type AchievementUnlockedEvent = { uuid: string; achievementId: string };

export type AchievementEventMap = {
	unlocked: AchievementUnlockedEvent;
};

export const achievementEvents = new TypedEventEmitter<AchievementEventMap>();
