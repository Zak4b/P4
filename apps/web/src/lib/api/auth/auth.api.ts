import type { Me, User } from "@p4/schemas/user";
import { apiClient, API_BASE } from "../api_client";

export class AuthApi {
	static async register(username: string, email: string, password: string): Promise<User> {
		const { data } = await apiClient.post<User>("/auth/register", { username, email, password });
		return data;
	}

	static async login(email: string, password: string): Promise<User> {
		const { data } = await apiClient.post<User>("/auth/login", { email, password });
		return data;
	}

	static async logout(): Promise<void> {
		await apiClient.post("/auth/logout");
	}

	static oauthUrl(): string {
		return `${API_BASE}/auth/google`;
	}

	static async getMe(): Promise<Me> {
		const { data } = await apiClient.get<Me>("/me");
		return data;
	}
}
