// API client for backend communication
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const API_BASE = `${BACKEND_URL}/P4`;

export interface User {
	id: number;
	name: string;
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

interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}

export interface Room {
	id: string;
	name: string;
	count: number;
	max: number;
	joinable: boolean;
	status: "waiting" | "playing" | "finished";
}

class ApiClient {
	private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
		const url = `${API_BASE}${endpoint}`;
		const response = await fetch(url, {
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
			...options,
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ error: "Network error" }));
			throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
		}

		return await response.json();
	}

	// Auth endpoints
	async register(name: string, email: string, password: string): Promise<RegisterResponse> {
		return this.request<RegisterResponse>("/login/register", {
			method: "POST",
			body: JSON.stringify({ name, email, password }),
		});
	}

	async login(email: string, password: string): Promise<LoginResponse> {
		return this.request<LoginResponse>("/login", {
			method: "POST",
			body: JSON.stringify({ email, password }),
		});
	}

	async logout(): Promise<LoginResponse> {
		return this.request<LoginResponse>("/login/logout", {
			method: "POST",
		});
	}

	async getLoginStatus(): Promise<LoginStatus> {
		return this.request<LoginStatus>("/login/status");
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
		return this.request<any[]>("/api/users");
	}

	async getHistory(): Promise<any[]> {
		return this.request<any[]>("/api/history");
	}

	async getScore(): Promise<any[]> {
		return this.request<any[]>("/api/score");
	}
}

export const apiClient = new ApiClient();
export type { LoginResponse, RegisterResponse, LoginStatus };
