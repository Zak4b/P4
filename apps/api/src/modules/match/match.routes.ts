import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { GameHistoryService } from "./game-history.service.js";

export function matchRoutes(fastify: FastifyInstance) {
	fastify.get("/", async (request: FastifyRequest<{ Querystring: { limit?: string; startFrom?: string } }>, reply: FastifyReply) => {
		const limit = request.query.limit ? parseInt(request.query.limit) : undefined;
		const gameHistory = await GameHistoryService.get({ limit });
		reply.send(gameHistory);
	});
}