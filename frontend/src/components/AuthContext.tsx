// AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import { apiClient } from "../api";

interface AuthContextType {
	isAuthenticated: boolean;
	login: (username: string) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const login = async (username: string) => {
		apiClient.login(username).then((response) => {
			if (response.success) {
				setIsAuthenticated(true);
			} else {
				throw new Error(response.error || "Login failed");
			}
		});
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

	return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
	return ctx;
};
