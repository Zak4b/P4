import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { Room } from "@p4/schemas/room";
import { RoomApi } from "./room.api";
import { roomKeys } from "./room.keys";

export function useRoomsQuery(options?: Partial<UseQueryOptions<Room[]>>) {
	return useQuery({
		queryKey: roomKeys.list(),
		queryFn: () => RoomApi.list(),
		...options,
	});
}
