import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { Me } from "@p4/schemas/user";
import { AuthApi } from "./auth.api";
import { authKeys } from "./auth.keys";

export function useMeQuery(options?: Partial<UseQueryOptions<Me>>) {
	return useQuery({
		queryKey: authKeys.me(),
		queryFn: () => AuthApi.getMe(),
		retry: false,
		...options,
	});
}
