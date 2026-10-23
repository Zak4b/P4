import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { Avatar, Style } from "@dicebear/core";
import micah from "@dicebear/styles/micah.json" with { type: "json" };
import { userIdParamSchema } from "@p4/schemas/http";
import { TAGS } from "../../config/api-tags.js";
import { UserService } from "../user/user.service.js";
import { HttpError } from "../../lib/HttpError.js";

const micahStyle = new Style(micah);

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
			const svg = new Avatar(micahStyle, { seed: user.login }).toString();

			reply.header("Content-Type", "image/svg+xml").send(svg);
		},
	);
};
