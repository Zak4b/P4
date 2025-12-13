import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {UserService} from "../services/user.service.js";
import { generateAvatar } from "../lib/avatar.js";
import { HttpError } from "../lib/HttpError.js";

export function userRoutes(fastify: FastifyInstance) {
	fastify.get("/", async (_, reply: FastifyReply) => {
		const users = await UserService.listAll();
		reply.send(users);
	});
	
	fastify.get("/:id", async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
		const { id } = request.params;
		const user = await UserService.getByLogin(id);
		if (!user) {
			throw HttpError.notFound("User not found");
		}
		reply.send(user);
	});

	fastify.get("/:id/stats", async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
		const { id } = request.params;
		const stats = await UserService.getStats(id);
		if (!stats) {
			throw HttpError.notFound("User not found");
		}
		reply.send(stats);
	});

	fastify.get("/:id/avatar", async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
		const { id } = request.params;
		const svg = generateAvatar(id, "micah");
		reply.type("image/svg+xml").send(svg);
	});

	fastify.get("/leaderboard", async (request: FastifyRequest, reply: FastifyReply) => {
		const leaderboard = await UserService.getLeaderboard(10);
		reply.send(leaderboard);
	});
}

