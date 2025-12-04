"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { apiClient, User } from "@/lib/api";

interface AuthContextType {
	isAuthenticated: boolean;
	isAuthReady: boolean;
	user: User | null;
	login: (email: string, password: string) => Promise<void>;
	register: (name: string, email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isAuthReady, setIsAuthReady] = useState(false);
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		let mounted = true;
		apiClient
			.getLoginStatus()
			.then((response) => {
				if (!mounted) return;
				setIsAuthenticated(!!response.isLoggedIn);
				setUser(response.user || null);
			})
			.catch((error) => {
				console.error("Failed to get login status:", error);
				if (!mounted) return;
				setIsAuthenticated(false);
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

	const login = async (email: string, password: string) => {
		const response = await apiClient.login(email, password);
		if (response.success && response.user) {
			setIsAuthenticated(true);
			setUser(response.user);
		} else {
			throw new Error(response.error || "Login failed");
		}
	};

	const register = async (name: string, email: string, password: string) => {
		const response = await apiClient.register(name, email, password);
		if (response.success && response.user) {
			setIsAuthenticated(true);
			setUser(response.user);
		} else {
			throw new Error(response.error || "Registration failed");
		}
	};

	const logout = async () => {
		apiClient
			.logout()
			.then(() => {
				setIsAuthenticated(false);
				setUser(null);
				window.location.reload();
			})
			.catch((error) => {
				console.error("Logout failed:", error);
			});
	};

	return <AuthContext.Provider value={{ isAuthenticated, isAuthReady, user, login, register, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
	return ctx;
};
