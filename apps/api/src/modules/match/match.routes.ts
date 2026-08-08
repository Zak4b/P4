import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { GameHistoryService } from "./game-history.service.js";
import { matchQuerySchema, matchSchema } from "@p4/schemas/match";
import { badRequestSchema, unauthorizedSchema } from "@p4/schemas/http";
import { TAGS } from "../../config/api-tags.js";

export const matchRoutes: FastifyPluginAsyncZod = async (fastify) => {
	fastify.get(
		"/",
		{
			schema: {
				operationId: "listMatches",
				tags: [TAGS.matches],
				summary: "Historique des parties",
				querystring: matchQuerySchema,
				response: {
					200: z.array(matchSchema),
					400: badRequestSchema,
					401: unauthorizedSchema,
				},
			},
		},
		async (request, reply) => {
			const gameHistory = await GameHistoryService.get({ limit: request.query.limit });
			reply.send(gameHistory);
		},
	);
};
