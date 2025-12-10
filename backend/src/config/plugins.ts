import type { FastifyInstance } from "fastify";
import { env } from "./env.js";
import { getCorsOptions } from "./cors.js";

/**
 * Enregistre les plugins Fastify nécessaires
 */
export async function registerPlugins(fastify: FastifyInstance): Promise<void> {
	// Plugin CORS
	await fastify.register(import("@fastify/cors"), getCorsOptions());
	
	// Plugin Cookie
	await fastify.register(import("@fastify/cookie"), {
		secret: env.jwt.secret,
		parseOptions: {},
	});
}






