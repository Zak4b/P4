import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/lib/api/user/user.keys";
import { AuthApi } from "./auth.api";

export function useLoginMutation() {
	return useMutation({
		mutationFn: ({ email, password }: { email: string; password: string }) => AuthApi.login(email, password),
	});
}

export function useRegisterMutation() {
	return useMutation({
		mutationFn: ({ login, email, password }: { login: string; email: string; password: string }) =>
			AuthApi.register(login, email, password),
	});
}

export function useLogoutMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => AuthApi.logout(),
		onSuccess: () => queryClient.setQueryData(userKeys.me(), null),
	});
}
