import type { RoomBroadcaster } from "../game-engine/types.js";
import { getSocketIO } from "../bootstrap/plugins/socket-io.plugin.js";
import { emitServerMessage } from "./socket-emit.js";
import { gameRoom, userRoom } from "./socket-rooms.js";

export const socketBroadcaster: RoomBroadcaster = {
	toRoom(roomId, message) {
		emitServerMessage(getSocketIO().to(gameRoom(roomId)), message);
	},
	toUser(userId, message) {
		emitServerMessage(getSocketIO().to(userRoom(userId)), message);
	},
	broadcast(message) {
		emitServerMessage(getSocketIO(), message);
	},
	evictRoom(roomId) {
		getSocketIO().in(gameRoom(roomId)).socketsLeave(gameRoom(roomId));
	},
};
