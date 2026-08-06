import { prisma } from "../../lib/prisma.js";
import type { FriendStatus } from "../../generated/prisma/enums.js";

const FRIEND_USER_SELECT = { id: true, login: true, eloRating: true } as const;

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

	static async createRequest(fromUserId: string, toUserId: string) {
		return await prisma.friendRequest.create({
			data: {
				fromUserId,
				toUserId,
				status: "PENDING",
			},
		});
	}

	static async deleteRequest(id: string) {
		return await prisma.friendRequest.delete({
			where: { id },
		});
	}

	static async findPendingForUser(userId: string) {
		return await prisma.friendRequest.findMany({
			where: {
				toUserId: userId,
				status: "PENDING",
			},
			include: {
				fromUser: {
					select: FRIEND_USER_SELECT,
				},
			},
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
			include: {
				fromUser: {
					select: FRIEND_USER_SELECT,
				},
				toUser: {
					select: FRIEND_USER_SELECT,
				},
			},
		});
	}
}
