// API client for backend communication
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
const API_BASE = `${BACKEND_URL}/P4`;

export const getAvatarUrl = (login: string): string => {
	return `${API_BASE}/user/${encodeURIComponent(login)}/avatar`;
};

export interface User {
	id: string;
	login: string;
	email: string;
}

interface LoginResponse {
	success: boolean;
	message?: string;
	error?: string;
	user?: User;
}

interface RegisterResponse {
	success: boolean;
	message?: string;
	error?: string;
	user?: User;
}

interface LoginStatus {
	isLoggedIn: boolean;
	user: User | null;
}

export interface Room {
	id: string;
	name: string;
	count: number;
	max: number;
	joinable: boolean;
	status: "waiting" | "playing" | "finished";
}

export interface UserStats {
	eloRating: number;
	totalGames: number;
	wins: number;
	losses: number;
	draws: number;
}

class ApiClient {
	private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
		const url = `${API_BASE}${endpoint}`;
		const hasBody = options.body !== undefined;
		const headers: HeadersInit = {
			...(hasBody ? { "Content-Type": "application/json" } : {}),
			...options.headers,
		};
		const response = await fetch(url, {
			credentials: "include",
			headers,
			...options,
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ error: "Network error" }));
			throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
		}

		return await response.json();
	}

	// Auth endpoints
	async register(login: string, email: string, password: string): Promise<RegisterResponse> {
		return this.request<RegisterResponse>("/auth/register", {
			method: "POST",
			body: JSON.stringify({ login, email, password }),
		});
	}

	async login(email: string, password: string): Promise<LoginResponse> {
		return this.request<LoginResponse>("/auth/login", {
			method: "POST",
			body: JSON.stringify({ email, password }),
		});
	}

	async logout(): Promise<LoginResponse> {
		return this.request<LoginResponse>("/auth/logout", {
			method: "POST",
		});
	}

	async getLoginStatus(): Promise<LoginStatus> {
		return this.request<LoginStatus>("/auth/status");
	}

	// Game API endpoints
	async getRooms(): Promise<Room[]> {
		return this.request<Room[]>("/api/rooms");
	}

	async joinRoom(roomId: string): Promise<{ success: boolean; roomId: string; message?: string }> {
		return this.request<{ success: boolean; roomId: string; message?: string }>("/game/join", {
			method: "POST",
			body: JSON.stringify({ roomId }),
		});
	}

	async getUsers(): Promise<any[]> {
		return this.request<any[]>("/user");
	}

	async getHistory(): Promise<any[]> {
		return this.request<any[]>("/match");
	}

	async getUserStats(id: string): Promise<UserStats> {
		return this.request<UserStats>(`/user/${encodeURIComponent(id)}/stats`);
	}

}

export const apiClient = new ApiClient();
export type { LoginResponse, RegisterResponse, LoginStatus };

