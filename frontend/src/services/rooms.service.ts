import { manager } from "../lib/websocket";

const listAll = (uuid?: string) => {
	const rooms = Array.from(manager.list.values()).map((room) => {
		const playerCount = room.playerList.length;
		const playerLimit = room.playerLimit;
		return {
			id: room.id,
			name: room.id,
			count: playerCount,
			max: playerLimit,
			joinable: playerCount < playerLimit,
			status: "playing",
		};
	});
	return rooms;
};

export default { listAll };
