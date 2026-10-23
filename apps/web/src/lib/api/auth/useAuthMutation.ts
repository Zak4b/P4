import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/lib/api/user/user.keys";
import { AuthApi } from "./auth.api";

export function useLoginMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ email, password }: { email: string; password: string }) => AuthApi.login(email, password),
		onSuccess: () => queryClient.refetchQueries({ queryKey: userKeys.me() }),
	});
}

export function useRegisterMutation() {
	return useMutation({
		mutationFn: ({ username, email, password }: { username: string; email: string; password: string }) =>
			AuthApi.register(username, email, password),
	});
}

export function useLogoutMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => AuthApi.logout(),
		onSuccess: () => queryClient.setQueryData(userKeys.me(), null),
	});
}
