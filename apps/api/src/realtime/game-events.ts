import { TypedEventEmitter } from "../game-engine/typed-event-emitter.js";

type RegisteredPlayer = { uuid: string; playerId: number };

export type MatchPlayEvent = {
	roomId: string;
	player: RegisteredPlayer;
	x: number;
	y: number;
	turnCount: number;
};

export type MatchEndedEvent = {
	roomId: string;
	registeredPlayers: RegisteredPlayer[];
	duration: number;
	turnCount: number;
	winnerUuid: string | null;
};

export type GameEventMap = {
	"match:play": MatchPlayEvent;
	"match:ended": MatchEndedEvent;
};

export const gameEvents = new TypedEventEmitter<GameEventMap>();
