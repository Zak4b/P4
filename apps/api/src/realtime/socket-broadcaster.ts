import type { RoomBroadcaster } from "../game-engine/types.js";
import { getSocketIO } from "../bootstrap/plugins/socket-io.plugin.js";
import { gameRoom, userRoom } from "./socket-rooms.js";

export const socketBroadcaster: RoomBroadcaster = {
	toRoom(roomId, message) {
		getSocketIO().to(gameRoom(roomId)).emit(message.type, message.data);
	},
	toUser(userId, message) {
		getSocketIO().to(userRoom(userId)).emit(message.type, message.data);
	},
	broadcast(message) {
		getSocketIO().emit(message.type, message.data);
	},
	evictRoom(roomId) {
		void getSocketIO().in(gameRoom(roomId)).socketsLeave(gameRoom(roomId));
	},
};
