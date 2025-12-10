export interface Message {
	id: string;
	type: "info" | "message" | "vote";
	content: string;
	author?: string;
	authorId?: string;
	timestamp: Date;
}

export type MessageAction =
	| { type: "add"; payload: Message }
	| { type: "reset"; payload: Message[] }
	| { type: "remove"; payload: string };

