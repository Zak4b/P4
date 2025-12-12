import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {UserService} from "../services/user.service.js";
import { generateAvatar } from "../lib/avatar.js";

export async function userRoutes(fastify: FastifyInstance) {
	fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const users = await UserService.listAll();
			reply.send(users);
		} catch (error) {
			reply.status(500).send({ error: "Internal server error" });
		}
	});
	
	fastify.get("/:id", async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
		try {
			const { id } = request.params;
			const user = await UserService.getByLogin(id);
			if (!user) {
				reply.status(404).send({ error: "User not found" });
				return;
			}
			reply.send(user);
		} catch (error) {
			reply.status(500).send({ error: "Internal server error" });
		}
	});

	fastify.get("/:id/stats", async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
		try {
			const { id } = request.params;
			const stats = await UserService.getStats(id);
			reply.send(stats);
		} catch (error) {
			reply.status(500).send({ error: "Internal server error" });
		}
	});

	fastify.get("/:id/avatar", async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
		try {
			const { id } = request.params;

			const svg = generateAvatar(id, "micah");
			reply.type("image/svg+xml").send(svg);
		} catch (error) {
			reply.status(500).send({ error: "Internal server error" });
		}
	});

	fastify.get("/leaderboard", async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const leaderboard = await UserService.getLeaderboard(10);
			reply.send(leaderboard);
		} catch (error) {
			reply.status(500).send({ error: "Internal server error" });
		}
	});
}

