import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { FriendService } from "./friend.service.js";
import { UserService } from "../user/user.service.js";
import { HttpError } from "../../lib/HttpError.js";
import { createFriendRequestSchema, friendRequestQuerySchema, friendRequestSchema } from "@p4/schemas/friend";
import {
	badRequestSchema,
	conflictSchema,
	forbiddenSchema,
	notFoundSchema,
	unauthorizedSchema,
	noContentSchema,
	idParamSchema,
} from "@p4/schemas/http";
import { TAGS } from "../../config/api-tags.js";

/**
 * `/friend-requests` : la demande d'ami comme ressource propre. Le `{id}` des
 * chemins est celui renvoyé par la collection — plus celui de l'expéditeur.
 */
export const friendRequestRoutes: FastifyPluginAsyncZod = async (fastify) => {
	fastify.get(
		"/",
		{
			// Monté sur `/ressource`, jamais sur `/ressource/` : un seul chemin par ressource.
			prefixTrailingSlash: "no-slash",
			schema: {
				operationId: "listFriendRequests",
				tags: [TAGS.friendRequests],
				summary: "Lister les demandes d'ami en attente",
				description: "Demandes reçues par défaut ; `direction=out` renvoie celles envoyées, que l'on peut annuler.",
				querystring: friendRequestQuerySchema,
				response: {
					200: z.array(friendRequestSchema),
					400: badRequestSchema,
					401: unauthorizedSchema,
				},
			},
		},
		async (request, reply) => {
			const currentUser = request.user;
			if (!currentUser) throw HttpError.unauthorized("Authentication required");

			const requests = await FriendService.listRequests(currentUser.id, request.query.direction);
			reply.send(requests);
		},
	);

	/** Envoyer une demande — 201 : la ressource créée, adressable via `Location`. */
	fastify.post(
		"/",
		{
			// Monté sur `/ressource`, jamais sur `/ressource/` : un seul chemin par ressource.
			prefixTrailingSlash: "no-slash",
			schema: {
				operationId: "createFriendRequest",
				tags: [TAGS.friendRequests],
				summary: "Envoyer une demande d'ami",
				body: createFriendRequestSchema,
				response: {
					201: friendRequestSchema,
					400: badRequestSchema,
					401: unauthorizedSchema,
					404: notFoundSchema,
					409: conflictSchema,
				},
			},
		},
		async (request, reply) => {
			const currentUser = request.user;
			if (!currentUser) throw HttpError.unauthorized("Authentication required");

			const { toUserId } = request.body;
			const target = await UserService.getById(toUserId);
			if (!target) throw HttpError.notFound("User not found");

			const result = await FriendService.sendRequest(currentUser.id, target.id);

			if (!result.success) {
				if (result.reason === "friends") throw HttpError.conflict("Already friends");
				if (result.reason === "pending") throw HttpError.conflict("Friend request already pending");
				throw HttpError.badRequest("Cannot send a friend request to yourself");
			}

			// URL de la ressource créée, déduite du chemin de collection (insensible au préfixe de montage)
			const collectionPath = (request.url.split("?")[0] ?? request.url).replace(/\/$/, "");
			reply.header("Location", `${collectionPath}/${result.request.id}`).status(201).send(result.request);
		},
	);

	/** Accepter une demande reçue — 204 : la relation devient une amitié. */
	fastify.post(
		"/:id/accept",
		{
			schema: {
				operationId: "acceptFriendRequest",
				tags: [TAGS.friendRequests],
				summary: "Accepter une demande d'ami",
				params: idParamSchema,
				response: {
					204: noContentSchema,
					400: badRequestSchema,
					401: unauthorizedSchema,
					403: forbiddenSchema,
					404: notFoundSchema,
				},
			},
		},
		async (request, reply) => {
			const currentUser = request.user;
			if (!currentUser) throw HttpError.unauthorized("Authentication required");

			const result = await FriendService.acceptRequest(currentUser.id, request.params.id);

			if (!result.success) {
				if (result.reason === "forbidden") {
					throw HttpError.forbidden("Only the recipient can accept this request");
				}
				throw HttpError.notFound("Friend request not found");
			}

			reply.status(204).send();
		},
	);

	/** Refuser (destinataire) ou annuler (émetteur) — 204 : la demande disparaît. */
	fastify.delete(
		"/:id",
		{
			schema: {
				operationId: "deleteFriendRequest",
				tags: [TAGS.friendRequests],
				summary: "Refuser ou annuler une demande d'ami",
				description: "Le destinataire refuse la demande, l'émetteur l'annule. Dans les deux cas elle est supprimée.",
				params: idParamSchema,
				response: {
					204: noContentSchema,
					400: badRequestSchema,
					401: unauthorizedSchema,
					403: forbiddenSchema,
					404: notFoundSchema,
				},
			},
		},
		async (request, reply) => {
			const currentUser = request.user;
			if (!currentUser) throw HttpError.unauthorized("Authentication required");

			const result = await FriendService.deleteRequest(currentUser.id, request.params.id);

			if (!result.success) {
				if (result.reason === "forbidden") {
					throw HttpError.forbidden("Not a party to this request");
				}
				throw HttpError.notFound("Friend request not found");
			}

			reply.status(204).send();
		},
	);
};
