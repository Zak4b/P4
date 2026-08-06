import { FriendRepository } from "./friend.repository.js";
import type { FriendRequestDirection, RelationStatus } from "@p4/schemas/friend";

type RequestWithParties = NonNullable<Awaited<ReturnType<typeof FriendRepository.findRequestById>>>;

/** Représentation exposée d'une demande : son id est celui adressable sur `/friend-requests/{id}`. */
function toFriendRequest(request: RequestWithParties) {
	return {
		id: request.id,
		fromUser: request.fromUser,
		toUser: request.toUser,
		createdAt: request.createdAt.getTime(),
	};
}

export class FriendService {
	/** Statut de la relation entre currentUserId et targetUserId */
	static async getRelationStatus(currentUserId: string, targetUserId: string): Promise<RelationStatus> {
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
	static async sendRequest(fromUserId: string, toUserId: string) {
		if (fromUserId === toUserId) {
			return { success: false, reason: "self" } as const;
		}

		const existing = await FriendService.getRelationStatus(fromUserId, toUserId);
		if (existing !== "none") {
			return { success: false, reason: existing } as const;
		}

		const created = await FriendRepository.createRequest(fromUserId, toUserId);

		return { success: true, request: toFriendRequest(created) } as const;
	}

	/** Demandes en attente, reçues par défaut ou envoyées par l'utilisateur. */
	static async listRequests(userId: string, direction: FriendRequestDirection) {
		const requests =
			direction === "out"
				? await FriendRepository.findPendingFromUser(userId)
				: await FriendRepository.findPendingForUser(userId);

		return requests.map(toFriendRequest);
	}

	/**
	 * Accepter une demande, désignée par son propre id. Seul le destinataire le
	 * peut : pour l'émetteur la demande existe mais ne lui est pas adressée.
	 */
	static async acceptRequest(currentUserId: string, requestId: string) {
		const request = await FriendRepository.findRequestById(requestId);

		if (!request || request.status !== "PENDING") {
			return { success: false, reason: "not-found" } as const;
		}
		if (request.toUserId !== currentUserId) {
			return { success: false, reason: "forbidden" } as const;
		}

		await FriendRepository.updateRequestStatus(request.id, "ACCEPTED");
		return { success: true } as const;
	}

	/**
	 * Supprimer une demande en attente : le destinataire refuse, l'émetteur annule.
	 * Une demande déjà acceptée n'est plus une demande — c'est `removeFriend`.
	 */
	static async deleteRequest(currentUserId: string, requestId: string) {
		const request = await FriendRepository.findRequestById(requestId);

		if (!request || request.status !== "PENDING") {
			return { success: false, reason: "not-found" } as const;
		}
		if (request.toUserId !== currentUserId && request.fromUserId !== currentUserId) {
			return { success: false, reason: "forbidden" } as const;
		}

		await FriendRepository.deleteRequest(request.id);
		return { success: true } as const;
	}

	/** Retirer un ami : supprime la relation acceptée, quel qu'en soit l'émetteur. */
	static async removeFriend(currentUserId: string, targetUserId: string) {
		if (currentUserId === targetUserId) {
			return { success: false } as const;
		}

		const sent = await FriendRepository.findRequestByPair(currentUserId, targetUserId);

		if (sent && sent.status === "ACCEPTED") {
			await FriendRepository.deleteRequest(sent.id);
			return { success: true } as const;
		}

		const received = await FriendRepository.findRequestByPair(targetUserId, currentUserId);

		if (received && received.status === "ACCEPTED") {
			await FriendRepository.deleteRequest(received.id);
			return { success: true } as const;
		}

		return { success: false } as const;
	}

	/** Liste des amis (utilisateurs avec relation ACCEPTED) */
	static async list(userId: string) {
		const accepted = await FriendRepository.findAcceptedForUser(userId);

		return accepted.map((fr) => {
			const friend = fr.fromUserId === userId ? fr.toUser : fr.fromUser;
			return { id: friend.id, login: friend.login, eloRating: friend.eloRating, xp: friend.xp };
		});
	}
}
