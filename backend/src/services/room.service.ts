import { manager } from "../websocket.js";
import type { Room } from "../game/room/Room.js";
import type { P4 } from "../game/P4.js";

interface RoomResponse {
	id: string;
	name: string;
	count: number;
	max: number;
	joinable: boolean;
	status: "idle" | "playing";
}

function formatRoom(room: Room<typeof P4>) {
	const playerCount = room.playerList.length;
	const playerLimit = room.playerLimit;
	return {
		id: room.id,
		name: room.name,
		count: playerCount,
		max: playerLimit,
		joinable: playerCount < playerLimit,
		status: "playing" as const,
	};
}

export namespace RoomService {
  export const create = (name?: string): RoomResponse => {
		const room = manager.newRoom({ name });
		return formatRoom(room);
	};

  export const listAll = (uuid?: string): RoomResponse[] => { //TODO uuid filtrer
		const rooms = Array.from(manager.list.values()).map((room) => formatRoom(room));
		return rooms;
	};

	export const get = (id: string): RoomResponse | undefined => {
		const room = manager.get(id);
		if (!room) {
			return undefined;
		}
		return formatRoom(room);
	};
}