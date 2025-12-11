import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { GameService } from "../services/game.service.js";

export async function matchRoutes(fastify: FastifyInstance) {
	fastify.get("/", async (request: FastifyRequest<{ Querystring: { limit?: string; startFrom?: string } }>, reply: FastifyReply) => {
		try {
			const limit = request.query.limit ? parseInt(request.query.limit) : undefined;
			const history = await GameService.history({ limit });
			reply.send(history);
		} catch (error) {
			reply.status(500).send({ error: "Internal server error" });
		}
	});
}