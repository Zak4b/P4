import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { apiClient } from "../api";

interface AuthContextType {
	isAuthenticated: boolean;
	isAuthReady: boolean;
	login: (username: string) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isAuthReady, setIsAuthReady] = useState(false);

	useEffect(() => {
		let mounted = true;
		apiClient
			.getLoginStatus()
			.then((response) => {
				if (!mounted) return;
				setIsAuthenticated(!!response.isLoggedIn);
			})
			.catch(() => {
				if (!mounted) return;
				setIsAuthenticated(false);
			})
			.finally(() => {
				if (!mounted) return;
				setIsAuthReady(true);
			});
		return () => {
			mounted = false;
		};
	}, []);

	const login = async (username: string) => {
		const response = await apiClient.login(username);
		if (response.success) {
			setIsAuthenticated(true);
		} else {
			throw new Error(response.error || "Login failed");
		}
	};
	const logout = async () => {
		apiClient
			.logout()
			.then(() => {
				setIsAuthenticated(false);
				window.location.reload();
			})
			.catch((error) => {
				console.error("Logout failed:", error);
			});
	};

	return <AuthContext.Provider value={{ isAuthenticated, isAuthReady, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
	return ctx;
};
