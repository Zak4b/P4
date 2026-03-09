import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
	getFriendsList,
	getFriendPendingRequests,
	acceptFriendRequest,
	rejectFriendRequest,
	getFriendRelationStatus,
	sendFriendRequest,
	removeFriend,
} from "../services/friend.service.js";
import { getUserByIdOrLogin } from "../services/user.service.js";
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

		const friends = await getFriendsList(currentUser.id);
		reply.send(friends);
	});

	/** Demandes d'ami en attente */
	fastify.get("/requests", async (request: FastifyRequest, reply: FastifyReply) => {
		const currentUser = request.user;
		if (!currentUser) throw HttpError.unauthorized("Authentication required");

		const requests = await getFriendPendingRequests(currentUser.id);
		reply.send(requests);
	});

	/** Accepter une demande d'ami */
	fastify.post("/requests/:identifier/accept", async (request: FastifyRequest<{ Params: { identifier: string } }>, reply: FastifyReply) => {
		const currentUser = request.user;
		if (!currentUser) throw HttpError.unauthorized("Authentication required");

		const { identifier } = request.params;
		const fromUser = await getUserByIdOrLogin(identifier);
		if (!fromUser) throw HttpError.notFound("User not found");

		const result = await acceptFriendRequest(currentUser.id, fromUser.id);
		if (!result.success) throw HttpError.notFound("Request not found");

		reply.send({ success: true });
	});

	/** Refuser une demande d'ami */
	fastify.post("/requests/:identifier/reject", async (request: FastifyRequest<{ Params: { identifier: string } }>, reply: FastifyReply) => {
		const currentUser = request.user;
		if (!currentUser) throw HttpError.unauthorized("Authentication required");

		const { identifier } = request.params;
		const fromUser = await getUserByIdOrLogin(identifier);
		if (!fromUser) throw HttpError.notFound("User not found");

		const result = await rejectFriendRequest(currentUser.id, fromUser.id);
		if (!result.success) throw HttpError.notFound("Request not found");

		reply.send({ success: true });
	});

	/** Statut de la relation avec un joueur (id ou login) */
	fastify.get("/status/:identifier", async (request: FastifyRequest<{ Params: { identifier: string } }>, reply: FastifyReply) => {
		const currentUser = request.user;
		if (!currentUser) throw HttpError.unauthorized("Authentication required");

		const { identifier } = request.params;
		const target = await getUserByIdOrLogin(identifier);
		if (!target) throw HttpError.notFound("User not found");

		const status = await getFriendRelationStatus(currentUser.id, target.id);
		reply.send({ status });
	});

	/** Envoyer une demande d'ami */
	fastify.post("/request/:identifier", async (request: FastifyRequest<{ Params: { identifier: string } }>, reply: FastifyReply) => {
		const currentUser = request.user;
		if (!currentUser) throw HttpError.unauthorized("Authentication required");

		const { identifier } = request.params;
		const target = await getUserByIdOrLogin(identifier);
		if (!target) throw HttpError.notFound("User not found");

		const result = await sendFriendRequest(currentUser.id, target.id);

		if (!result.success && result.status === "friends") {
			throw HttpError.conflict("Already friends");
		}
		if (!result.success && result.status === "pending") {
			throw HttpError.conflict("Friend request already pending");
		}

		reply.send({ success: true, status: result.status });
	});

	/** Retirer un ami */
	fastify.delete("/request/:identifier", async (request: FastifyRequest<{ Params: { identifier: string } }>, reply: FastifyReply) => {
		const currentUser = request.user;
		if (!currentUser) throw HttpError.unauthorized("Authentication required");

		const { identifier } = request.params;
		const target = await getUserByIdOrLogin(identifier);
		if (!target) throw HttpError.notFound("User not found");

		const result = await removeFriend(currentUser.id, target.id);

		if (!result.success) {
			throw HttpError.notFound("Friendship not found");
		}

		reply.send({ success: true });
	});
}
