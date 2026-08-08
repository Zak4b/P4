import type { Match } from "@p4/schemas/match";
import { apiClient } from "../api_client";

export class MatchApi {
	static async list(): Promise<Match[]> {
		const { data } = await apiClient.get<Match[]>("/matches");
		return data;
	}
}
