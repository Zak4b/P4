import type { FastifyInstance } from "fastify";
import { authRoutes } from "../modules/auth/auth.routes.js";
import { auth } from "../modules/auth/auth.middleware.js";
import { userRoutes } from "../modules/user/user.routes.js";
import { leaderboardRoutes } from "../modules/user/leaderboard.routes.js";
import { meRoutes } from "../modules/user/me.routes.js";
import { matchRoutes } from "../modules/match/match.routes.js";
import { roomRoutes } from "../modules/room/room.routes.js";
import { friendRoutes } from "../modules/friend/friend.routes.js";
import { friendRequestRoutes } from "../modules/friend/friend-request.routes.js";

export async function routes(fastify: FastifyInstance) {
	await fastify.register(authRoutes, { prefix: "/auth" });

	// Protected API routes
	await fastify.register(async function (fastify) {
		fastify.addHook("onRequest", auth);

		await fastify.register(meRoutes, { prefix: "/me" });
		await fastify.register(userRoutes, { prefix: "/users" });
		await fastify.register(leaderboardRoutes, { prefix: "/leaderboard" });
		await fastify.register(matchRoutes, { prefix: "/matches" });
		await fastify.register(roomRoutes, { prefix: "/rooms" });
		await fastify.register(friendRoutes, { prefix: "/friends" });
		await fastify.register(friendRequestRoutes, { prefix: "/friend-requests" });
	});
}
