import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createAvatar } from "@dicebear/core";
import { create, schema } from "@dicebear/micah";
import { userIdParamSchema } from "@p4/schemas/http";
import { TAGS } from "../../config/api-tags.js";
import { UserService } from "../user/user.service.js";
import { HttpError } from "../../lib/HttpError.js";

const micahStyle = { create, schema };

export const avatarSvgRoutes: FastifyPluginAsyncZod = async (fastify) => {
	fastify.get(
		"/:userId",
		{
			schema: {
				operationId: "getAvatarSvg",
				tags: [TAGS.avatars],
				summary: "SVG avatar for a user",
				params: userIdParamSchema,
			},
		},
		async (request, reply) => {
			const { userId } = request.params;
			const user = await UserService.getById(userId);
			if (!user) {
				throw HttpError.notFound();
			}
			const svg = createAvatar(micahStyle, { seed: user.login }).toString();

			reply.header("Content-Type", "image/svg+xml").send(svg);
		},
	);
};
