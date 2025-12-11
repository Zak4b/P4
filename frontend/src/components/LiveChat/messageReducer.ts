import { Message, MessageAction } from "./types";

export const messageReducer = (state: Message[], action: MessageAction): Message[] => {
	switch (action.type) {
		case "add":
			return [...state, action.payload];
		case "reset":
			return action.payload;
		case "remove":
			return state.filter((msg) => msg.id !== action.payload);
		default:
			return state;
	}
};

