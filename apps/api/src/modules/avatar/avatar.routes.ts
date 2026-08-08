import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import type { Prisma } from "../../generated/prisma/client.js";
import { avatarSaveBodySchema, avatarSaveResponseSchema, AVATAR_STYLE } from "@p4/schemas/avatar";
import { badRequestSchema, unauthorizedSchema } from "@p4/schemas/http";
import { UserService } from "../user/user.service.js";
import { HttpError } from "../../lib/HttpError.js";
import { TAGS } from "../../config/api-tags.js";

export const avatarRoutes: FastifyPluginAsyncZod = async (fastify) => {
	fastify.post(
		"/",
		{
			schema: {
				operationId: "saveMyAvatar",
				tags: [TAGS.me],
				summary: "Enregistrer la configuration d'avatar du joueur authentifié",
				body: avatarSaveBodySchema,
				response: {
					200: avatarSaveResponseSchema,
					400: badRequestSchema,
					401: unauthorizedSchema,
				},
			},
		},
		async (request, reply) => {
			const currentUser = request.user;
			if (!currentUser) throw HttpError.unauthorized("Authentication required");

			await UserService.saveAvatarConfig(currentUser.id, AVATAR_STYLE, request.body.options as Prisma.InputJsonValue);

			reply.send({ success: true });
		},
	);
};
