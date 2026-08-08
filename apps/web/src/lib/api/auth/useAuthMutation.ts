import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthApi } from "./auth.api";
import { authKeys } from "./auth.keys";

export function useLoginMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ email, password }: { email: string; password: string }) => AuthApi.login(email, password),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.me() }),
	});
}

export function useRegisterMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ login, email, password }: { login: string; email: string; password: string }) =>
			AuthApi.register(login, email, password),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.me() }),
	});
}

export function useLogoutMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => AuthApi.logout(),
		onSuccess: () => queryClient.setQueryData(authKeys.me(), null),
	});
}
