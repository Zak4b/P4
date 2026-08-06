// Types pour les événements Socket.IO émis par le serveur
export interface SyncEvent {
	playerId: number | null;
	cPlayer: number;
	board?: number[][];
	last?: { x: number; y: number };
}

export interface PlayEvent {
	playerId: number;
	x: number;
	y: number;
	nextPlayerId: number;
}

export interface WinEvent {
	uuid: string;
	playerid: number;
}

export interface JoinResponse {
	success: boolean;
	roomId?: string;
	playerId?: number;
	error?: string;
}

export interface MatchedEvent {
	roomId: string;
	playerId: number;
}

export interface PlayersEvent {
	localId: number;
	name: string;
}

export type PlayerJoinedEvent = PlayersEvent;

export interface MessageEvent {
	clientId: string;
	displayName?: string;
	message: string;
}

export interface InfoEvent {
	data: string;
}

export interface VoteEvent {
	text: string;
	command: string;
}
