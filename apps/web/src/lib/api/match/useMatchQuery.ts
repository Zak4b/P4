import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { Match } from "@p4/schemas/match";
import { MatchApi } from "./match.api";
import { matchKeys } from "./match.keys";

export function useMatchQuery(options?: Partial<UseQueryOptions<Match[]>>) {
	return useQuery({
		queryKey: matchKeys.history(),
		queryFn: () => MatchApi.list(),
		...options,
	});
}
