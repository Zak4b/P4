import type { FriendRequest, Relation } from "@p4/schemas/friend";
import type { GameHistory } from "@p4/schemas/match";
import type { Room } from "@p4/schemas/room";
import type { Me, User, UserProfile, UserStats } from "@p4/schemas/user";

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
const API_BASE = `${BACKEND_URL}/api`;

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

	/** URL pour initier la connexion Google (redirection) */
	getGoogleLoginUrl(): string {
		return `${API_BASE}/auth/google`;
	}

	async getMe(): Promise<Me> {
		return this.request<Me>("/me");
	}

	// Game API endpoints
	async getRooms(): Promise<Room[]> {
		return this.request<Room[]>("/rooms");
	}

	/** 201 : renvoie la room créée. Le créateur vient de la session, seuls ses invités se déclarent. */
	async newRoom(name: string, invited?: string[]): Promise<Room> {
		return this.request<Room>("/rooms", {
			method: "POST",
			body: JSON.stringify({ name, invited }),
		});
	}

	async getHistory(): Promise<GameHistory[]> {
		return this.request<GameHistory[]>("/matches");
	}

	async getUser(id: string): Promise<User> {
		return this.request<User>(`/users/${encodeURIComponent(id)}`);
	}

	async getUserStats(id: string): Promise<UserStats> {
		return this.request<UserStats>(`/users/${encodeURIComponent(id)}/stats`);
	}

	/** Profil public : le joueur et son bilan, recomposés à partir des deux endpoints. */
	async getProfile(id: string): Promise<UserProfile> {
		const [user, stats] = await Promise.all([this.getUser(id), this.getUserStats(id)]);
		return { ...user, stats };
	}

	/** Liste des amis */
	async getFriends(): Promise<User[]> {
		return this.request<User[]>("/friends");
	}

	/** Demandes d'ami reçues, en attente */
	async getFriendRequests(): Promise<FriendRequest[]> {
		return this.request<FriendRequest[]>("/friend-requests");
	}

	/** Demandes d'ami envoyées, encore en attente — celles que l'on peut annuler */
	async getSentFriendRequests(): Promise<FriendRequest[]> {
		return this.request<FriendRequest[]>("/friend-requests?direction=out");
	}

	/** Accepter une demande reçue (204) */
	async acceptFriendRequest(requestId: string): Promise<void> {
		return this.requestVoid(`/friend-requests/${encodeURIComponent(requestId)}/accept`, {
			method: "POST",
		});
	}

	/** Refuser une demande reçue, ou annuler une demande envoyée (204) */
	async deleteFriendRequest(requestId: string): Promise<void> {
		return this.requestVoid(`/friend-requests/${encodeURIComponent(requestId)}`, {
			method: "DELETE",
		});
	}

	/** Envoyer une demande d'ami (201 : renvoie la demande créée) */
	async sendFriendRequest(toUserId: string): Promise<FriendRequest> {
		return this.request<FriendRequest>("/friend-requests", {
			method: "POST",
			body: JSON.stringify({ toUserId }),
		});
	}

	/** Relation d'amitié avec un joueur */
	async getFriendStatus(userId: string): Promise<Relation> {
		return this.request<Relation>(`/users/${encodeURIComponent(userId)}/friendship`);
	}

	/** Retirer un ami (204) */
	async removeFriend(userId: string): Promise<void> {
		return this.requestVoid(`/friends/${encodeURIComponent(userId)}`, {
			method: "DELETE",
		});
	}

	async getLeaderboard(): Promise<User[]> {
		return this.request<User[]>("/leaderboard");
	}
}

export const apiClient = new ApiClient();
