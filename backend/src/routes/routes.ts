import { FastifyInstance } from "fastify";
import { loginRoutes } from "./login.js";
import { apiRoutes } from "./api.js";
import { gameRoutes } from "./game.js";
import { auth } from "../middleware/auth.js";

export async function registerRoutes(fastify: FastifyInstance) {
	// Public login routes (no auth required)
	await fastify.register(loginRoutes, { prefix: "/P4/login" });

	// Protected API routes
	await fastify.register(async function (fastify) {
		// Ajouter le hook auth pour toutes les routes dans ce registre
		fastify.addHook("onRequest", auth);

		await fastify.register(apiRoutes, { prefix: "/P4/api" });
		await fastify.register(gameRoutes, { prefix: "/P4/game" });
	});
}
