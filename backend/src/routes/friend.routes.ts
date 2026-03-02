import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { FriendService, FriendRelationStatus } from "../services/friend.service.js";
import { UserService } from "../services/user.service.js";
import { HttpError } from "../lib/HttpError.js";

declare module "fastify" {
	interface FastifyRequest {
		user?: { id: string; email: string; login: string };
	}
}

export function friendRoutes(fastify: FastifyInstance) {
	/** Liste des amis */
	fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
		const currentUser = request.user;
		if (!currentUser) throw HttpError.unauthorized("Authentication required");

		const friends = await FriendService.getFriends(currentUser.id);
		reply.send(friends);
	});

	/** Statut de la relation avec un joueur (id ou login) */
	fastify.get(
		"/status/:identifier",
		async (
			request: FastifyRequest<{ Params: { identifier: string } }>,
			reply: FastifyReply
		) => {
			const currentUser = request.user;
			if (!currentUser) throw HttpError.unauthorized("Authentication required");

			const { identifier } = request.params;
			const target = await UserService.getByIdOrLogin(identifier);
			if (!target) throw HttpError.notFound("User not found");

			const status = await FriendService.getRelationStatus(currentUser.id, target.id);
			reply.send({ status });
		}
	);

	/** Envoyer une demande d'ami */
	fastify.post(
		"/request/:identifier",
		async (
			request: FastifyRequest<{ Params: { identifier: string } }>,
			reply: FastifyReply
		) => {
			const currentUser = request.user;
			if (!currentUser) throw HttpError.unauthorized("Authentication required");

			const { identifier } = request.params;
			const target = await UserService.getByIdOrLogin(identifier);
			if (!target) throw HttpError.notFound("User not found");

			const result = await FriendService.sendRequest(currentUser.id, target.id);

			if (!result.success && result.status === "friends") {
				throw HttpError.conflict("Already friends");
			}
			if (!result.success && result.status === "pending") {
				throw HttpError.conflict("Friend request already pending");
			}

			reply.send({ success: true, status: result.status });
		}
	);

	/** Retirer un ami */
	fastify.delete(
		"/request/:identifier",
		async (
			request: FastifyRequest<{ Params: { identifier: string } }>,
			reply: FastifyReply
		) => {
			const currentUser = request.user;
			if (!currentUser) throw HttpError.unauthorized("Authentication required");

			const { identifier } = request.params;
			const target = await UserService.getByIdOrLogin(identifier);
			if (!target) throw HttpError.notFound("User not found");

			const result = await FriendService.removeFriend(currentUser.id, target.id);

			if (!result.success) {
				throw HttpError.notFound("Friendship not found");
			}

			reply.send({ success: true });
		}
	);
}
