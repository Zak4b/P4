import { useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import type { Me, User, UserStats } from "@p4/schemas/user";
import { AuthApi } from "@/lib/api/auth/auth.api";
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

export function useMeQuery(options?: Partial<UseQueryOptions<Me>>) {
	const queryClient = useQueryClient();

	return useQuery({
		queryKey: userKeys.me(),
		queryFn: async () => {
			const me = await AuthApi.getMe();
			queryClient.setQueryData(userKeys.detail(me.id), me);
			return me;
		},
		retry: false,
		...options,
	});
}
