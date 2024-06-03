import { rooms } from "../websocket.js";

const listAll = (uuid?: string) => {
	const playerCounts = Object.entries(rooms.list).map(([roomId, room]) => {
		//room.registeredPlayerList.map((p) => p.uuid).includes(uuid);
		return [roomId, { count: room.playerCount, max: room.playerMaxCount, full: room.playerCount >= room.playerMaxCount }];
	});
	return Object.fromEntries(playerCounts);
};

export default { listAll };
