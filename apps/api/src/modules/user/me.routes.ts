import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { UserService } from "./user.service.js";
import { HttpError } from "../../lib/HttpError.js";
import { meSchema } from "@p4/schemas/user";
import { unauthorizedSchema } from "@p4/schemas/http";
import { TAGS } from "../../config/api-tags.js";
import { avatarRoutes } from "../avatar/avatar.routes.js";

export const meRoutes: FastifyPluginAsyncZod = async (fastify) => {
	await fastify.register(avatarRoutes, { prefix: "/avatar" });

	fastify.get(
		"/",
		{
			prefixTrailingSlash: "no-slash",
			schema: {
				operationId: "getMe",
				tags: [TAGS.me],
				summary: "Profil du joueur authentifié",
				response: {
					200: meSchema,
					401: unauthorizedSchema,
				},
			},
		},
		async (request, reply) => {
			const currentUser = request.user;
			if (!currentUser) {
				throw HttpError.unauthorized("Authentication required");
			}

			const me = await UserService.getMe(currentUser.id);
			if (!me) {
				throw HttpError.unauthorized("Session user no longer exists");
			}
			reply.send(me);
		},
	);
};
