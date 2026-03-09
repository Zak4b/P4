import { getAvatarDataUrl } from "./avatar";

// API client for backend communication
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
const API_BASE = `${BACKEND_URL}/api`;

/** Génère l'URL (data URL) de l'avatar Dicebear côté client */
export const getAvatarUrl = (login: string): string => {
	return getAvatarDataUrl(login);
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
	xp: number;
	level: number;
	xpInCurrentLevel: number;
	xpRequiredForNextLevel: number;
	totalGames: number;
	wins: number;
	losses: number;
	draws: number;
}

export interface UserProfile extends UserStats {
	id: string;
	login: string;
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

	/** URL pour initier la connexion Google (redirection) */
	getGoogleLoginUrl(): string {
		return `${API_BASE}/auth/google`;
	}

	// Game API endpoints
	async getRooms(): Promise<Room[]> {
		return this.request<Room[]>("/room");
	}

	async newRoom(
		name: string,
		players?: string[]
	): Promise<{ success: boolean; roomId?: string; message?: string }> {
		return this.request<{ success: boolean; roomId?: string; message?: string }>("/room", {
			method: "POST",
			body: JSON.stringify({ name, players }),
		});
	}

	async newAIRoom(): Promise<{ success: boolean; roomId?: string }> {
		return this.request<{ success: boolean; roomId?: string }>("/room/ai", {
			method: "POST",
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

	/** Profil complet d'un joueur (id ou login) */
	async getProfile(identifier: string): Promise<UserProfile> {
		return this.request<UserProfile>(`/user/profile/${encodeURIComponent(identifier)}`);
	}

	/** Liste des amis */
	async getFriends(): Promise<Array<{ id: string; login: string; eloRating: number }>> {
		return this.request<Array<{ id: string; login: string; eloRating: number }>>("/friend");
	}

	/** Demandes d'ami en attente */
	async getFriendRequests(): Promise<
		Array<{ id: string; fromUser: { id: string; login: string; eloRating: number } }>
	> {
		return this.request("/friend/requests");
	}

	/** Accepter une demande d'ami */
	async acceptFriendRequest(identifier: string): Promise<{ success: boolean }> {
		return this.request(`/friend/requests/${encodeURIComponent(identifier)}/accept`, {
			method: "POST",
		});
	}

	/** Refuser une demande d'ami */
	async rejectFriendRequest(identifier: string): Promise<{ success: boolean }> {
		return this.request(`/friend/requests/${encodeURIComponent(identifier)}/reject`, {
			method: "POST",
		});
	}

	/** Statut amical avec un joueur */
	async getFriendStatus(identifier: string): Promise<{ status: "none" | "pending" | "friends" }> {
		return this.request<{ status: "none" | "pending" | "friends" }>(
			`/friend/status/${encodeURIComponent(identifier)}`
		);
	}

	/** Envoyer une demande d'ami */
	async sendFriendRequest(identifier: string): Promise<{ success: boolean; status: "none" | "pending" | "friends" }> {
		return this.request<{ success: boolean; status: "none" | "pending" | "friends" }>(
			`/friend/request/${encodeURIComponent(identifier)}`,
			{ method: "POST" }
		);
	}

	/** Retirer un ami */
	async removeFriendRequest(identifier: string): Promise<{ success: boolean }> {
		return this.request<{ success: boolean }>(
			`/friend/request/${encodeURIComponent(identifier)}`,
			{ method: "DELETE" }
		);
	}

	async getLeaderboard(): Promise<Array<{ id: string; login: string; eloRating: number; xp: number; level: number }>> {
		return this.request<Array<{ id: string; login: string; eloRating: number; xp: number; level: number }>>("/user/leaderboard");
	}

}

export const apiClient = new ApiClient();
export type { LoginResponse, RegisterResponse, LoginStatus };

