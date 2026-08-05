import { FastifyInstance } from "fastify";
import { authRoutes } from "../modules/auth/auth.routes.js";
import { auth } from "../modules/auth/auth.middleware.js";
import { userRoutes } from "../modules/user/user.routes.js";
import { matchRoutes } from "../modules/match/match.routes.js";
import { roomRoutes } from "../modules/room/room.routes.js";
import { friendRoutes } from "../modules/friend/friend.routes.js";

export async function routes(fastify: FastifyInstance) {
	await fastify.register(authRoutes, { prefix: "/auth" });

	// Protected API routes
	await fastify.register(async function (fastify) {
		fastify.addHook("onRequest", auth);

		await fastify.register(userRoutes, { prefix: "/user" });
		await fastify.register(matchRoutes, { prefix: "/match" });
		await fastify.register(roomRoutes, { prefix: "/room" });
		await fastify.register(friendRoutes, { prefix: "/friend" });
	});
}
