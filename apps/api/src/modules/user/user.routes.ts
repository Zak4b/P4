import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { UserService } from "./user.service.js";
import { FriendService } from "../friend/friend.service.js";
import { HttpError } from "../../lib/HttpError.js";
import { userSchema, userStatsSchema } from "@p4/schemas/user";
import { relationSchema } from "@p4/schemas/friend";
import {
	badRequestSchema,
	notFoundSchema,
	unauthorizedSchema,
	userPathIdSchema,
} from "@p4/schemas/http";
import { TAGS } from "../../config/api-tags.js";

export const userRoutes: FastifyPluginAsyncZod = async (fastify) => {
	fastify.get(
		"/",
		{
			// Monté sur `/ressource`, jamais sur `/ressource/` : un seul chemin par ressource.
			prefixTrailingSlash: "no-slash",
			schema: {
				operationId: "listUsers",
				tags: [TAGS.users],
				summary: "Lister les joueurs",
				response: {
					200: z.array(userSchema),
					401: unauthorizedSchema,
				},
			},
		},
		async (_request, reply) => {
			const users = await UserService.listAll();
			reply.send(users);
		},
	);

	// Un joueur, par son id
	fastify.get(
		"/:id",
		{
			schema: {
				operationId: "getUser",
				tags: [TAGS.users],
				summary: "Récupérer un joueur par son id",
				params: userPathIdSchema,
				response: {
					200: userSchema,
					400: badRequestSchema,
					401: unauthorizedSchema,
					404: notFoundSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params;
			const user = await UserService.getById(id);
			if (!user) {
				throw HttpError.notFound("User not found");
			}
			reply.send(user);
		},
	);

	// Bilan des parties d'un joueur
	fastify.get(
		"/:id/stats",
		{
			schema: {
				operationId: "getUserStats",
				tags: [TAGS.users],
				summary: "Statistiques de parties d'un joueur",
				params: userPathIdSchema,
				response: {
					200: userStatsSchema,
					400: badRequestSchema,
					401: unauthorizedSchema,
					404: notFoundSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params;
			const user = await UserService.getById(id);
			if (!user) {
				throw HttpError.notFound("User not found");
			}
			const stats = await UserService.getStats(user.id);
			if (!stats) {
				throw HttpError.notFound("User not found");
			}
			reply.send(stats);
		},
	);

	/**
	 * La relation avec ce joueur, vue depuis la session : c'est un attribut du
	 * joueur consulté, d'où sa place sous `/users/{id}` plutôt que sous `/friends`.
	 */
	fastify.get(
		"/:id/friendship",
		{
			schema: {
				operationId: "getFriendship",
				tags: [TAGS.users],
				summary: "Relation d'amitié avec un joueur",
				params: userPathIdSchema,
				response: {
					200: relationSchema,
					400: badRequestSchema,
					401: unauthorizedSchema,
					404: notFoundSchema,
				},
			},
		},
		async (request, reply) => {
			const currentUser = request.user;
			if (!currentUser) throw HttpError.unauthorized("Authentication required");

			const { id } = request.params;
			const target = await UserService.getById(id);
			if (!target) throw HttpError.notFound("User not found");

			const status = await FriendService.getRelationStatus(currentUser.id, target.id);
			reply.send({ status });
		},
	);
};
