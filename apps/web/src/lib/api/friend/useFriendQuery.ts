import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { FriendRequest, Relation } from "@p4/schemas/friend";
import type { User } from "@p4/schemas/user";
import { FriendApi } from "./friend.api";
import { friendKeys } from "./friend.keys";

export function useFriendsQuery(options?: Partial<UseQueryOptions<User[]>>) {
	return useQuery({ queryKey: friendKeys.list(), queryFn: () => FriendApi.list(), ...options });
}

export function useFriendRequestsQuery(options?: Partial<UseQueryOptions<FriendRequest[]>>) {
	return useQuery({ queryKey: friendKeys.requests(), queryFn: () => FriendApi.requests(), ...options });
}

export function useSentFriendRequestsQuery(options?: Partial<UseQueryOptions<FriendRequest[]>>) {
	return useQuery({
		queryKey: friendKeys.sentRequests(),
		queryFn: () => FriendApi.sentRequests(),
		...options,
	});
}

export function useFriendStatusQuery(userId: string | undefined, options?: Partial<UseQueryOptions<Relation>>) {
	return useQuery({
		queryKey: friendKeys.status(userId ?? ""),
		queryFn: () => FriendApi.status(userId as string),
		enabled: Boolean(userId),
		...options,
	});
}
