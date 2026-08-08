import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RoomApi } from "./room.api";
import { roomKeys } from "./room.keys";

export function useCreateRoomMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ name, invited }: { name: string; invited?: string[] }) => RoomApi.create(name, invited),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: roomKeys.list() }),
	});
}
