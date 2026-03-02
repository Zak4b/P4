import { prisma } from "../lib/prisma.js";

export type FriendRelationStatus = "none" | "pending" | "friends";

export namespace FriendService {
	/** Statut de la relation entre currentUserId et targetUserId */
	export const getRelationStatus = async (
		currentUserId: string,
		targetUserId: string
	): Promise<FriendRelationStatus> => {
		if (currentUserId === targetUserId) return "none";

		const sent = await prisma.friendRequest.findUnique({
			where: {
				fromUserId_toUserId: {
					fromUserId: currentUserId,
					toUserId: targetUserId,
				},
			},
		});

		if (sent) {
			return sent.status === "ACCEPTED" ? "friends" : "pending";
		}

		const received = await prisma.friendRequest.findUnique({
			where: {
				fromUserId_toUserId: {
					fromUserId: targetUserId,
					toUserId: currentUserId,
				},
			},
		});

		if (received) {
			return received.status === "ACCEPTED" ? "friends" : "pending";
		}

		return "none";
	};

	/** Envoyer une demande d'ami */
	export const sendRequest = async (
		fromUserId: string,
		toUserId: string
	): Promise<{ success: boolean; status: FriendRelationStatus }> => {
		if (fromUserId === toUserId) {
			return { success: false, status: "none" };
		}

		const existing = await getRelationStatus(fromUserId, toUserId);
		if (existing !== "none") {
			return { success: false, status: existing };
		}

		await prisma.friendRequest.create({
			data: {
				fromUserId,
				toUserId,
				status: "PENDING",
			},
		});

		return { success: true, status: "pending" };
	};

	/** Retirer un ami (supprimer la relation) */
	export const removeFriend = async (
		currentUserId: string,
		targetUserId: string
	): Promise<{ success: boolean }> => {
		if (currentUserId === targetUserId) {
			return { success: false };
		}

		const sent = await prisma.friendRequest.findUnique({
			where: {
				fromUserId_toUserId: {
					fromUserId: currentUserId,
					toUserId: targetUserId,
				},
			},
		});

		if (sent && sent.status === "ACCEPTED") {
			await prisma.friendRequest.delete({
				where: { id: sent.id },
			});
			return { success: true };
		}

		const received = await prisma.friendRequest.findUnique({
			where: {
				fromUserId_toUserId: {
					fromUserId: targetUserId,
					toUserId: currentUserId,
				},
			},
		});

		if (received && received.status === "ACCEPTED") {
			await prisma.friendRequest.delete({
				where: { id: received.id },
			});
			return { success: true };
		}

		return { success: false };
	};

	/** Liste des amis (utilisateurs avec relation ACCEPTED) */
	export const getFriends = async (userId: string) => {
		const accepted = await prisma.friendRequest.findMany({
			where: {
				status: "ACCEPTED",
				OR: [{ fromUserId: userId }, { toUserId: userId }],
			},
			include: {
				fromUser: {
					select: { id: true, login: true, eloRating: true },
				},
				toUser: {
					select: { id: true, login: true, eloRating: true },
				},
			},
		});

		return accepted.map((fr) => {
			const friend = fr.fromUserId === userId ? fr.toUser : fr.fromUser;
			return { id: friend.id, login: friend.login, eloRating: friend.eloRating };
		});
	};
}
