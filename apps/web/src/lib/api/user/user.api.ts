import type { Me, User, UserStats } from "@p4/schemas/user";
import { apiClient } from "../api_client";

export class UserApi {
	static async find(id: string): Promise<User> {
		const { data } = await apiClient.get<User>(`/users/${encodeURIComponent(id)}`);
		return data;
	}

	static async findStats(id: string): Promise<UserStats> {
		const { data } = await apiClient.get<UserStats>(`/users/${encodeURIComponent(id)}/stats`);
		return data;
	}

	static async leaderboard(): Promise<User[]> {
		const { data } = await apiClient.get<User[]>("/leaderboard");
		return data;
	}

	static async updateUsername(username: string): Promise<Me> {
		const { data } = await apiClient.patch<Me>("/me/username", { username });
		return data;
	}
}
