export interface FriendRequest {
	id: string;
	fromUser: { id: string; login: string; eloRating: number };
}
