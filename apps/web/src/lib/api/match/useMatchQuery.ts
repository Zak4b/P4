import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { Match } from "@p4/schemas/match";
import { MatchApi } from "./match.api";
import { matchKeys } from "./match.keys";

export function useMatchQuery(playerId?: string, options?: Partial<UseQueryOptions<Match[]>>) {
	return useQuery({
		queryKey: matchKeys.history(playerId),
		queryFn: () => MatchApi.list(playerId),
		...options,
	});
}
