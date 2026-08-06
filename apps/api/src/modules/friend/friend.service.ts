import { FriendRepository } from "./friend.repository.js";

export type FriendRelationStatus = "none" | "pending" | "friends";

export class FriendService {
	/** Statut de la relation entre currentUserId et targetUserId */
	static async getRelationStatus(currentUserId: string, targetUserId: string): Promise<FriendRelationStatus> {
		if (currentUserId === targetUserId) return "none";

		const sent = await FriendRepository.findRequestByPair(currentUserId, targetUserId);

		if (sent) {
			return sent.status === "ACCEPTED" ? "friends" : "pending";
		}

		const received = await FriendRepository.findRequestByPair(targetUserId, currentUserId);

		if (received) {
			return received.status === "ACCEPTED" ? "friends" : "pending";
		}

		return "none";
	}

	/** Envoyer une demande d'ami */
	static async sendRequest(
		fromUserId: string,
		toUserId: string,
	): Promise<{ success: boolean; status: FriendRelationStatus }> {
		if (fromUserId === toUserId) {
			return { success: false, status: "none" };
		}

		const existing = await FriendService.getRelationStatus(fromUserId, toUserId);
		if (existing !== "none") {
			return { success: false, status: existing };
		}

		await FriendRepository.createRequest(fromUserId, toUserId);

		return { success: true, status: "pending" };
	}

	/** Retirer un ami (supprimer la relation) */
	static async remove(currentUserId: string, targetUserId: string): Promise<{ success: boolean }> {
		if (currentUserId === targetUserId) {
			return { success: false };
		}

		const sent = await FriendRepository.findRequestByPair(currentUserId, targetUserId);

		if (sent && sent.status === "ACCEPTED") {
			await FriendRepository.deleteRequest(sent.id);
			return { success: true };
		}

		const received = await FriendRepository.findRequestByPair(targetUserId, currentUserId);

		if (received && received.status === "ACCEPTED") {
			await FriendRepository.deleteRequest(received.id);
			return { success: true };
		}

		return { success: false };
	}

	/** Demandes en attente reçues par l'utilisateur */
	static async getRequests(userId: string) {
		const requests = await FriendRepository.findPendingForUser(userId);
		return requests.map((r) => ({
			id: r.id,
			fromUser: r.fromUser,
		}));
	}

	/** Accepter une demande d'ami */
	static async accept(currentUserId: string, fromUserId: string): Promise<{ success: boolean }> {
		const request = await FriendRepository.findRequestByPair(fromUserId, currentUserId);
		if (!request || request.status !== "PENDING") {
			return { success: false };
		}
		await FriendRepository.updateRequestStatus(request.id, "ACCEPTED");
		return { success: true };
	}

	/** Refuser/annuler une demande d'ami */
	static async reject(currentUserId: string, fromUserId: string): Promise<{ success: boolean }> {
		const request = await FriendRepository.findRequestByPair(fromUserId, currentUserId);
		if (!request || request.status !== "PENDING") {
			return { success: false };
		}
		await FriendRepository.deleteRequest(request.id);
		return { success: true };
	}

	/** Liste des amis (utilisateurs avec relation ACCEPTED) */
	static async list(userId: string) {
		const accepted = await FriendRepository.findAcceptedForUser(userId);

		return accepted.map((fr) => {
			const friend = fr.fromUserId === userId ? fr.toUser : fr.fromUser;
			return { id: friend.id, login: friend.login, eloRating: friend.eloRating };
		});
	}
}
