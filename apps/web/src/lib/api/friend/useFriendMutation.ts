import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FriendApi } from "./friend.api";
import { friendKeys } from "./friend.keys";

export function useAcceptFriendRequestMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (requestId: string) => FriendApi.accept(requestId),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: friendKeys.all }),
	});
}

export function useDeleteFriendRequestMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (requestId: string) => FriendApi.reject(requestId),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: friendKeys.all }),
	});
}

export function useSendFriendRequestMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (toUserId: string) => FriendApi.add(toUserId),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: friendKeys.all }),
	});
}

export function useRemoveFriendMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (userId: string) => FriendApi.remove(userId),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: friendKeys.all }),
	});
}
