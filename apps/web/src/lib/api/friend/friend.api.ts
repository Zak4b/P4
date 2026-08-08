import type { FriendRequest, Relation } from "@p4/schemas/friend";
import type { User } from "@p4/schemas/user";
import { apiClient } from "../api_client";

export class FriendApi {
	static async list(): Promise<User[]> {
		const { data } = await apiClient.get<User[]>("/friends");
		return data;
	}

	static async requests(): Promise<FriendRequest[]> {
		const { data } = await apiClient.get<FriendRequest[]>("/friend-requests");
		return data;
	}

	static async sentRequests(): Promise<FriendRequest[]> {
		const { data } = await apiClient.get<FriendRequest[]>("/friend-requests?direction=out");
		return data;
	}

	static async accept(requestId: string): Promise<void> {
		await apiClient.post(`/friend-requests/${encodeURIComponent(requestId)}/accept`);
	}

	static async reject(requestId: string): Promise<void> {
		await apiClient.delete(`/friend-requests/${encodeURIComponent(requestId)}`);
	}

	static async add(toUserId: string): Promise<FriendRequest> {
		const { data } = await apiClient.post<FriendRequest>("/friend-requests", { toUserId });
		return data;
	}

	static async status(userId: string): Promise<Relation> {
		const { data } = await apiClient.get<Relation>(`/users/${encodeURIComponent(userId)}/friendship`);
		return data;
	}

	static async remove(userId: string): Promise<void> {
		await apiClient.delete(`/friends/${encodeURIComponent(userId)}`);
	}
}
