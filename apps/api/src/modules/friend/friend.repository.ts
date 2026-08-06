import { prisma } from "../../lib/prisma.js";
import type { FriendStatus } from "../../generated/prisma/enums.js";

const FRIEND_USER_SELECT = { id: true, login: true, eloRating: true, xp: true } as const;

/** Les deux parties d'une demande, pour une représentation lisible dans les deux sens. */
const REQUEST_PARTIES_INCLUDE = {
	fromUser: { select: FRIEND_USER_SELECT },
	toUser: { select: FRIEND_USER_SELECT },
} as const;

export class FriendRepository {
	static async findRequestByPair(fromUserId: string, toUserId: string) {
		return await prisma.friendRequest.findUnique({
			where: {
				fromUserId_toUserId: {
					fromUserId,
					toUserId,
				},
			},
		});
	}

	/** Accès direct par l'identifiant exposé sur `/friend-requests/{id}`. */
	static async findRequestById(id: string) {
		return await prisma.friendRequest.findUnique({
			where: { id },
			include: REQUEST_PARTIES_INCLUDE,
		});
	}

	static async createRequest(fromUserId: string, toUserId: string) {
		return await prisma.friendRequest.create({
			data: {
				fromUserId,
				toUserId,
				status: "PENDING",
			},
			include: REQUEST_PARTIES_INCLUDE,
		});
	}

	static async deleteRequest(id: string) {
		return await prisma.friendRequest.delete({
			where: { id },
		});
	}

	/** Demandes en attente reçues par `userId`. */
	static async findPendingForUser(userId: string) {
		return await prisma.friendRequest.findMany({
			where: {
				toUserId: userId,
				status: "PENDING",
			},
			include: REQUEST_PARTIES_INCLUDE,
			orderBy: { createdAt: "desc" },
		});
	}

	/** Demandes en attente envoyées par `userId` — celles qu'il peut annuler. */
	static async findPendingFromUser(userId: string) {
		return await prisma.friendRequest.findMany({
			where: {
				fromUserId: userId,
				status: "PENDING",
			},
			include: REQUEST_PARTIES_INCLUDE,
			orderBy: { createdAt: "desc" },
		});
	}

	static async updateRequestStatus(id: string, status: FriendStatus) {
		return await prisma.friendRequest.update({
			where: { id },
			data: { status },
		});
	}

	static async findAcceptedForUser(userId: string) {
		return await prisma.friendRequest.findMany({
			where: {
				status: "ACCEPTED",
				OR: [{ fromUserId: userId }, { toUserId: userId }],
			},
			include: REQUEST_PARTIES_INCLUDE,
		});
	}
}
