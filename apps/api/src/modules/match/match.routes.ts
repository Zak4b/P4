import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { GameHistoryService } from "./game-history.service.js";
import { gameHistoryQuerySchema, gameHistorySchema } from "@p4/schemas/match";
import { validationErrorResponseSchema } from "@p4/schemas/http";

export const matchRoutes: FastifyPluginAsyncZod = async (fastify) => {
	fastify.get(
		"/",
		{
			schema: {
				querystring: gameHistoryQuerySchema,
				response: {
					200: z.array(gameHistorySchema),
					400: validationErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const gameHistory = await GameHistoryService.get({ limit: request.query.limit });
			reply.send(gameHistory);
		},
	);
};
