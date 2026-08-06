// API client for backend communication
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
const API_BASE = `${BACKEND_URL}/api`;

export interface User {
	id: string;
	login: string;
	email: string;
}

interface Session {
	/** `null` = non connecté. */
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

export type Winner = "PLAYER1" | "PLAYER2" | "DRAW";

export type FriendRelationStatus = "none" | "pending" | "friends";

export interface HistoryPlayer {
	id: string;
	login: string;
	eloRating?: number;
}

export interface GameHistory {
	id: string;
	player1: HistoryPlayer;
	player2: HistoryPlayer;
	winner: Winner;
	board: number[][];
	time: number;
	duration: number;
}

class ApiClient {
	private async send(endpoint: string, options: RequestInit = {}): Promise<Response> {
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
			// Corps absent ou non JSON (ex. 5xx sans body) : on se rabat sur le statut
			const body = (await response.json().catch(() => null)) as { error?: string } | null;
			throw new Error(body?.error || `HTTP error! status: ${response.status}`);
		}

		return response;
	}

	/** Endpoints qui renvoient une représentation JSON. */
	private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
		const response = await this.send(endpoint, options);
		return (await response.json()) as T;
	}

	/** Endpoints qui répondent 204 No Content : il n'y a pas de corps à parser. */
	private async requestVoid(endpoint: string, options: RequestInit = {}): Promise<void> {
		await this.send(endpoint, options);
	}

	// Auth endpoints

	/** 201 : renvoie l'utilisateur créé. */
	async register(login: string, email: string, password: string): Promise<User> {
		return this.request<User>("/auth/register", {
			method: "POST",
			body: JSON.stringify({ login, email, password }),
		});
	}

	/** 200 : ouvre une session (portée par le cookie) et renvoie l'utilisateur connecté. */
	async login(email: string, password: string): Promise<User> {
		return this.request<User>("/auth/login", {
			method: "POST",
			body: JSON.stringify({ email, password }),
		});
	}

	/** Ferme la session (204). */
	async logout(): Promise<void> {
		return this.requestVoid("/auth/logout", {
			method: "POST",
		});
	}

	/** État de la session courante — `user` à `null` si personne n'est connecté. */
	async getSession(): Promise<Session> {
		return this.request<Session>("/auth/status");
	}

	/** URL pour initier la connexion Google (redirection) */
	getGoogleLoginUrl(): string {
		return `${API_BASE}/auth/google`;
	}

	// Game API endpoints
	async getRooms(): Promise<Room[]> {
		return this.request<Room[]>("/room");
	}

	/** 201 : renvoie la room créée. */
	async newRoom(name: string, players?: string[]): Promise<Room> {
		return this.request<Room>("/room", {
			method: "POST",
			body: JSON.stringify({ name, players }),
		});
	}

	async getHistory(): Promise<GameHistory[]> {
		return this.request<GameHistory[]>("/match");
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

	/** Accepter une demande d'ami (204) */
	async acceptFriendRequest(identifier: string): Promise<void> {
		return this.requestVoid(`/friend/requests/${encodeURIComponent(identifier)}/accept`, {
			method: "POST",
		});
	}

	/** Refuser une demande d'ami (204) */
	async rejectFriendRequest(identifier: string): Promise<void> {
		return this.requestVoid(`/friend/requests/${encodeURIComponent(identifier)}/reject`, {
			method: "POST",
		});
	}

	/** Statut amical avec un joueur */
	async getFriendStatus(identifier: string): Promise<{ status: FriendRelationStatus }> {
		return this.request<{ status: FriendRelationStatus }>(
			`/friend/status/${encodeURIComponent(identifier)}`
		);
	}

	/** Envoyer une demande d'ami (201 : renvoie le statut résultant de la relation) */
	async sendFriendRequest(identifier: string): Promise<{ status: FriendRelationStatus }> {
		return this.request<{ status: FriendRelationStatus }>(
			`/friend/request/${encodeURIComponent(identifier)}`,
			{ method: "POST" }
		);
	}

	/** Retirer un ami (204) */
	async removeFriendRequest(identifier: string): Promise<void> {
		return this.requestVoid(`/friend/request/${encodeURIComponent(identifier)}`, {
			method: "DELETE",
		});
	}

	async getLeaderboard(): Promise<Array<{ id: string; login: string; eloRating: number; xp: number; level: number }>> {
		return this.request<Array<{ id: string; login: string; eloRating: number; xp: number; level: number }>>("/user/leaderboard");
	}

}

export const apiClient = new ApiClient();
export type { Session };

