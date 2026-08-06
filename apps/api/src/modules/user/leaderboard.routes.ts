import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { UserService } from "./user.service.js";
import { leaderboardQuerySchema, userSchema } from "@p4/schemas/user";
import { badRequestSchema, unauthorizedSchema } from "@p4/schemas/http";
import { TAGS } from "../../config/api-tags.js";

/**
 * Le classement n'est pas un joueur : il vivait sous `/user/leaderboard`, où il
 * entrait en concurrence avec `/user/{id}`. C'est une ressource à part entière.
 */
export const leaderboardRoutes: FastifyPluginAsyncZod = async (fastify) => {
	fastify.get(
		"/",
		{
			// Monté sur `/ressource`, jamais sur `/ressource/` : un seul chemin par ressource.
			prefixTrailingSlash: "no-slash",
			schema: {
				operationId: "getLeaderboard",
				tags: [TAGS.leaderboard],
				summary: "Classement des meilleurs joueurs",
				querystring: leaderboardQuerySchema,
				response: {
					200: z.array(userSchema),
					400: badRequestSchema,
					401: unauthorizedSchema,
				},
			},
		},
		async (request, reply) => {
			const leaderboard = await UserService.getLeaderboard(request.query.limit);
			reply.send(leaderboard);
		},
	);
};
