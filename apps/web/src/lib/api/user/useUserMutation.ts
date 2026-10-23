import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserApi } from "./user.api";
import { userKeys } from "./user.keys";
import { matchKeys } from "../match/match.keys";

export function useUpdateUsernameMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (username: string) => UserApi.updateUsername(username),
		onSuccess: async (me) => {
			queryClient.setQueryData(userKeys.me(), me);
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: userKeys.all }),
				queryClient.invalidateQueries({ queryKey: matchKeys.all }),
			]);
		},
	});
}
