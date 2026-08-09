import type { P4 } from "../../game-engine/p4.js";
import type { Player } from "../../game-engine/index.js";
import type { AuthenticatedSocket } from "../socket-auth.js";
import { logger } from "../../lib/logger.js";
import { manager } from "./p4.js";

/** File d'attente : recherche automatique d'adversaire */
export function registerMatchmakingHandlers(socket: AuthenticatedSocket, player: Player<typeof P4>): void {
	socket.on("game:p4:matchmaking:join", async () => {
		logger.debug({ uuid: player.uuid, displayName: player.displayName }, "[matchmaking] game:p4:matchmaking:join");
		await manager.joinMatchmaking(player);
	});

	socket.on("game:p4:matchmaking:leave", () => {
		logger.debug({ uuid: player.uuid, displayName: player.displayName }, "[matchmaking] game:p4:matchmaking:leave");
		manager.leaveMatchmaking(player);
	});
}
