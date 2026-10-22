import type { Match } from "@p4/schemas/match";
import { apiClient } from "../api_client";

export class MatchApi {
	/** Les dernières parties ; avec `playerId`, seulement celles de ce joueur. */
	static async list(playerId?: string): Promise<Match[]> {
		const { data } = await apiClient.get<Match[]>("/matches", { params: playerId ? { playerId } : undefined });
		return data;
	}
}
