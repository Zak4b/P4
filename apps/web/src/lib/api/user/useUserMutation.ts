import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserApi } from "./user.api";
import { userKeys } from "./user.keys";
import { matchKeys } from "../match/match.keys";
import type { UpdateEmailBody, UpdatePasswordBody } from "@p4/schemas/auth";

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

export function useUpdateEmailMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (body: UpdateEmailBody) => UserApi.updateEmail(body),
		onSuccess: (me) => queryClient.setQueryData(userKeys.me(), me),
	});
}

export function useUpdatePasswordMutation() {
	return useMutation({
		mutationFn: (body: UpdatePasswordBody) => UserApi.updatePassword(body),
	});
}
