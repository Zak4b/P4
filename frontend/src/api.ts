// API client for backend communication
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const API_BASE = `${BACKEND_URL}/P4`;

interface LoginResponse {
	success: boolean;
	message?: string;
	error?: string;
}

interface LoginStatus {
	isLoggedIn: boolean;
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
	async login(username: string): Promise<LoginResponse> {
		return this.request<LoginResponse>("/login", {
			method: "POST",
			body: JSON.stringify({ username }),
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
export type { LoginResponse, LoginStatus };
