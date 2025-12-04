import { rooms } from "../websocket.js";

const listAll = (uuid?: string) => {
	// rooms.list est maintenant une Map, pas un objet
	const playerCounts = Array.from(rooms.list.values()).map((room) => {
		//room.registeredPlayerList.map((p) => p.uuid).includes(uuid);
		const playerCount = room.playerList.length;
		const playerLimit = room.playerLimit;
		return {
			id: room.id,
			name: room.id,
			count: playerCount,
			max: playerLimit,
			joinable: playerCount < playerLimit, // Une room est joinable si elle n'est pas pleine
			status: "playing",
		};
	});
	return playerCounts;
};

export default { listAll };
