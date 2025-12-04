import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import rooms from "../actions/rooms.js";
import user from "../actions/user.js";
import game from "../actions/game.js";

export async function apiRoutes(fastify: FastifyInstance) {
	fastify.get("/rooms", async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			reply.send(rooms.listAll());
		} catch (error) {
			reply.status(500).send({ error: "Internal server error" });
		}
	});

	fastify.get("/users", async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const users = await user.listAll();
			reply.send(users);
		} catch (error) {
			reply.status(500).send({ error: "Internal server error" });
		}
	});

	fastify.get("/history", async (request: FastifyRequest<{ Querystring: { limit?: string; startFrom?: string } }>, reply: FastifyReply) => {
		try {
			const limit = request.query.limit ? parseInt(request.query.limit) : undefined;
			const startFrom = request.query.startFrom ? parseInt(request.query.startFrom) : undefined;
			const history = await game.history(limit, startFrom);
			reply.send(history);
		} catch (error) {
			reply.status(500).send({ error: "Internal server error" });
		}
	});

	fastify.get("/score", async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const scores = await game.playerScore();
			reply.send(scores);
		} catch (error) {
			reply.status(500).send({ error: "Internal server error" });
		}
	});
}

