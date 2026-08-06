import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { FriendService } from "./friend.service.js";
import { UserService } from "../user/user.service.js";
import { HttpError } from "../../lib/HttpError.js";
import { userSchema } from "@p4/schemas/user";
import {
	badRequestSchema,
	notFoundSchema,
	unauthorizedSchema,
	noContentSchema,
	userIdParamSchema,
} from "@p4/schemas/http";
import { TAGS } from "../../config/api-tags.js";

export const friendRoutes: FastifyPluginAsyncZod = async (fastify) => {
	fastify.get(
		"/",
		{
			schema: {
				operationId: "listFriends",
				tags: [TAGS.friends],
				summary: "Lister ses amis",
				response: {
					200: z.array(userSchema),
					401: unauthorizedSchema,
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

	/** Retirer un ami — 204 : la relation est supprimée, rien à renvoyer. */
	fastify.delete(
		"/:userId",
		{
			schema: {
				operationId: "removeFriend",
				tags: [TAGS.friends],
				summary: "Retirer un ami",
				params: userIdParamSchema,
				response: {
					204: noContentSchema,
					400: badRequestSchema,
					401: unauthorizedSchema,
					404: notFoundSchema,
				},
			},
		},
		async (request, reply) => {
			const currentUser = request.user;
			if (!currentUser) throw HttpError.unauthorized("Authentication required");

			const { userId } = request.params;
			if (userId === currentUser.id) {
				throw HttpError.badRequest("Cannot remove yourself");
			}

			const target = await UserService.getById(userId);
			if (!target) throw HttpError.notFound("User not found");

			const result = await FriendService.removeFriend(currentUser.id, target.id);
			if (!result.success) throw HttpError.notFound("Friendship not found");

			reply.status(204).send();
		},
	);
};
