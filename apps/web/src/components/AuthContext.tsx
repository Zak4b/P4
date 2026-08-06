"use client";

import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import { apiClient } from "@/lib/api";
import type { AuthUser } from "@p4/schemas/auth";

interface AuthContextType {
	/** `false` tant que la session n'a pas été résolue : à distinguer de « non connecté ». */
	isAuthReady: boolean;
	/** `null` = non connecté. C'est la seule source de vérité, il n'y a pas de drapeau séparé. */
	user: AuthUser | null;
	login: (email: string, password: string) => Promise<void>;
	register: (login: string, email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuthReady, setIsAuthReady] = useState(false);
	const [user, setUser] = useState<AuthUser | null>(null);

	useEffect(() => {
		let mounted = true;
		apiClient
			.getSession()
			.then((session) => {
				if (!mounted) return;
				setUser(session.user);
			})
			.catch((error) => {
				console.error("Failed to get session:", error);
				if (!mounted) return;
				setUser(null);
			})
			.finally(() => {
				if (!mounted) return;
				setIsAuthReady(true);
			});
		return () => {
			mounted = false;
		};
	}, []);

	// Un statut d'erreur fait déjà rejeter apiClient : arriver ici signifie que c'est un succès
	const login = async (email: string, password: string) => {
		setUser(await apiClient.login(email, password));
	};

	const register = async (loginValue: string, email: string, password: string) => {
		setUser(await apiClient.register(loginValue, email, password));
	};

	const logout = async () => {
		apiClient
			.logout()
			.then(() => {
				setUser(null);
				window.location.reload();
			})
			.catch((error) => {
				console.error("Logout failed:", error);
			});
	};

	return <AuthContext.Provider value={{ isAuthReady, user, login, register, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside AuthProvider");

	return {
		...ctx,
		isAuthenticated: ctx.user !== null,
	};
};
