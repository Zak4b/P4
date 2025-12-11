import { FastifyInstance } from "fastify";
import { authRoutes } from "./auth.routes.js";
import { auth } from "../middleware/auth.js";
import { userRoutes } from "./user.routes.js";
import { matchRoutes } from "./match.routes.js";

export async function routes(fastify: FastifyInstance) {
	await fastify.register(authRoutes, { prefix: "/auth" });

	// Protected API routes
	await fastify.register(async function (fastify) {
		fastify.addHook("onRequest", auth);

		await fastify.register(userRoutes, { prefix: "/user" });
		await fastify.register(matchRoutes, { prefix: "/match" });
	});
}
