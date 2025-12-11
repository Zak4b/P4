export interface Message {
	type: string;
}

export interface ServerMessage {
	type: string;
	data?: unknown;
}
