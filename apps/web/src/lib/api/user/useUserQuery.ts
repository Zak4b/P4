import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { User, UserStats } from "@p4/schemas/user";
import { UserApi } from "./user.api";
import { userKeys } from "./user.keys";

export function useUserQuery(id: string, options?: Partial<UseQueryOptions<User>>) {
	return useQuery({
		queryKey: userKeys.detail(id),
		queryFn: () => UserApi.find(id),
		enabled: Boolean(id),
		...options,
	});
}

export function useUserStatsQuery(id: string, options?: Partial<UseQueryOptions<UserStats>>) {
	return useQuery({
		queryKey: userKeys.stats(id),
		queryFn: () => UserApi.findStats(id),
		enabled: Boolean(id),
		...options,
	});
}

export function useLeaderboardQuery(options?: Partial<UseQueryOptions<User[]>>) {
	return useQuery({
		queryKey: userKeys.leaderboard(),
		queryFn: () => UserApi.leaderboard(),
		...options,
	});
}
