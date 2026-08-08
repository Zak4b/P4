"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useMeQuery } from "@/lib/api/user/useUserQuery";
import { useLoginMutation, useLogoutMutation, useRegisterMutation } from "@/lib/api/auth/useAuthMutation";
import type { Me } from "@p4/schemas/user";

interface AuthContextType {
	/** `false` tant que la session n'a pas été résolue : à distinguer de « non connecté ». */
	isAuthReady: boolean;
	/** `null` = non connecté. C'est la seule source de vérité, il n'y a pas de drapeau séparé. */
	user: Me | null;
	login: (email: string, password: string) => Promise<void>;
	register: (login: string, email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const meQuery = useMeQuery();
	const loginMutation = useLoginMutation();
	const registerMutation = useRegisterMutation();
	const logoutMutation = useLogoutMutation();

	const isAuthReady = meQuery.isFetched;
	const user = meQuery.data ?? null;

	const login = async (email: string, password: string) => {
		await loginMutation.mutateAsync({ email, password });
	};

	const register = async (loginValue: string, email: string, password: string) => {
		await registerMutation.mutateAsync({ login: loginValue, email, password });
	};

	const logout = async () => {
		try {
			await logoutMutation.mutateAsync();
			window.location.reload();
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	return <AuthContext.Provider value={{ isAuthReady, user, login, register, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error("useAuth must be used inside AuthProvider");
	}

	return {
		...ctx,
		isAuthenticated: ctx.user !== null,
	};
};
