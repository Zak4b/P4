import { Socket } from "socket.io-client";

// Types pour les événements Socket.IO émis par le serveur
export interface RegisteredEvent {
	uuid: string;
}

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

// Types pour les événements Socket.IO écoutés par le serveur
export interface SocketClient {
	socket: Socket | null;
	isConnected: boolean;
	uuid: string | null;
	roomId: string | null;
	playerId: number | null;
}

