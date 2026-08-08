import type { Room } from "@p4/schemas/room";
import { apiClient } from "../api_client";

export class RoomApi {
	static async list(): Promise<Room[]> {
		const { data } = await apiClient.get<Room[]>("/rooms");
		return data;
	}

	static async create(name: string, invited?: string[]): Promise<Room> {
		const { data } = await apiClient.post<Room>("/rooms", { name, invited });
		return data;
	}
}
