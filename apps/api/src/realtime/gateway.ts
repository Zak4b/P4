import { P4 } from "../game-engine/p4.js";
import { Player } from "../game-engine/index.js";
import type { AuthenticatedSocket } from "./socket-auth.js";
import { userRoom } from "./socket-rooms.js";
import { registerP4Handlers } from "./handlers/p4.js";
import { registerMatchmakingHandlers } from "./handlers/matchmaking.js";
import { registerLivechatHandlers } from "./handlers/livechat.js";

export { manager, notifyPlayerJoinedRoom } from "./handlers/p4.js";

export const websocketConnection = async (socket: AuthenticatedSocket): Promise<void> => {
	// Posé par le middleware d'auth dans bootstrap/plugins/socket-io.plugin.ts avant que "connection" ne se déclenche
	const { user } = socket.data;
	if (!user) {
		// Défense en profondeur : ne devrait jamais arriver, le middleware garantit l'auth
		socket.disconnect(true);
		return;
	}
	const player = new Player<typeof P4>(socket, user.id, user.login);
	await socket.join(userRoom(player.uuid));
	await player.send({ type: "system:registered", data: player.uuid });

	registerP4Handlers(socket, player);
	registerMatchmakingHandlers(socket, player);
	registerLivechatHandlers(socket, player);
};
