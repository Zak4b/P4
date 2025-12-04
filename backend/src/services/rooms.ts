import { stat } from "node:fs";
import { rooms } from "../websocket.js";

const listAll = (uuid?: string) => {
	const playerCounts = Object.entries(rooms.list).map(([roomId, room]) => {
		//room.registeredPlayerList.map((p) => p.uuid).includes(uuid);
		return {
			id: room.id,
			name: room.id,
			count: room.playerCount,
			max: room.playerMaxCount,
			joinable: room.playerCount >= room.playerMaxCount,
			status: "playing",
		};
	});
	return playerCounts;
};

export default { listAll };
