import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { FriendService } from "./friend.service.js";
import { UserService } from "../user/user.service.js";
import { HttpError } from "../../lib/HttpError.js";
import { friendRequestSchema, friendSchema, relationSchema } from "@p4/schemas/friend";
import {
	errorResponseSchema,
	identifierParamsSchema,
	noContentSchema,
	validationErrorResponseSchema,
} from "@p4/schemas/http";

export const friendRoutes: FastifyPluginAsyncZod = async (fastify) => {
	/** Liste des amis */
	fastify.get(
		"/",
		{
			schema: {
				response: {
					200: z.array(friendSchema),
					401: errorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const currentUser = request.user;
			if (!currentUser) throw HttpError.unauthorized("Authentication required");

			const friends = await FriendService.list(currentUser.id);
			reply.send(friends);
		},
	);

	/** Demandes d'ami en attente */
	fastify.get(
		"/requests",
		{
			schema: {
				response: {
					200: z.array(friendRequestSchema),
					401: errorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const currentUser = request.user;
			if (!currentUser) throw HttpError.unauthorized("Authentication required");

			const requests = await FriendService.getRequests(currentUser.id);
			reply.send(requests);
		},
	);

	// Accepter une demande d'ami
	fastify.post(
		"/requests/:identifier/accept",
		{
			schema: {
				params: identifierParamsSchema,
				response: {
					204: noContentSchema,
					400: validationErrorResponseSchema,
					401: errorResponseSchema,
					404: errorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const currentUser = request.user;
			if (!currentUser) throw HttpError.unauthorized("Authentication required");

			const { identifier } = request.params;
			const fromUser = await UserService.getByIdOrLogin(identifier);
			if (!fromUser) throw HttpError.notFound("User not found");

			const result = await FriendService.accept(currentUser.id, fromUser.id);
			if (!result.success) throw HttpError.notFound("Request not found");

			reply.status(204).send();
		},
	);

	// Refuser une demande d'ami
	fastify.post(
		"/requests/:identifier/reject",
		{
			schema: {
				params: identifierParamsSchema,
				response: {
					204: noContentSchema,
					400: validationErrorResponseSchema,
					401: errorResponseSchema,
					404: errorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const currentUser = request.user;
			if (!currentUser) throw HttpError.unauthorized("Authentication required");

			const { identifier } = request.params;
			const fromUser = await UserService.getByIdOrLogin(identifier);
			if (!fromUser) throw HttpError.notFound("User not found");

			const result = await FriendService.reject(currentUser.id, fromUser.id);
			if (!result.success) throw HttpError.notFound("Request not found");

			reply.status(204).send();
		},
	);

	// Statut de la relation avec un joueur (id ou login)
	fastify.get(
		"/status/:identifier",
		{
			schema: {
				params: identifierParamsSchema,
				response: {
					200: relationSchema,
					400: validationErrorResponseSchema,
					401: errorResponseSchema,
					404: errorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const currentUser = request.user;
			if (!currentUser) throw HttpError.unauthorized("Authentication required");

			const { identifier } = request.params;
			const target = await UserService.getByIdOrLogin(identifier);
			if (!target) throw HttpError.notFound("User not found");

			const status = await FriendService.getRelationStatus(currentUser.id, target.id);
			reply.send({ status });
		},
	);

	// Envoyer une demande d'ami — 201 : une demande est créée
	fastify.post(
		"/request/:identifier",
		{
			schema: {
				params: identifierParamsSchema,
				response: {
					201: relationSchema,
					400: validationErrorResponseSchema,
					401: errorResponseSchema,
					404: errorResponseSchema,
					409: errorResponseSchema,
				},
			},
		},
		async (request, reply) => {
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
			// Seul cas d'échec restant : demande envoyée à soi-même — rien n'est créé, donc pas de 201
			if (!result.success) {
				throw HttpError.badRequest("Cannot send a friend request to yourself");
			}

			reply.status(201).send({ status: result.status });
		},
	);

	/** Retirer un ami — 204 : la relation est supprimée, rien à renvoyer */
	fastify.delete(
		"/request/:identifier",
		{
			schema: {
				params: identifierParamsSchema,
				response: {
					204: noContentSchema,
					400: validationErrorResponseSchema,
					401: errorResponseSchema,
					404: errorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const currentUser = request.user;
			if (!currentUser) throw HttpError.unauthorized("Authentication required");

			const { identifier } = request.params;
			const target = await UserService.getByIdOrLogin(identifier);
			if (!target) throw HttpError.notFound("User not found");

			const result = await FriendService.remove(currentUser.id, target.id);

			if (!result.success) {
				throw HttpError.notFound("Friendship not found");
			}

			reply.status(204).send();
		},
	);
};
