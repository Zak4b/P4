import type { FastifyInstance } from "fastify";

/**
 * Configure les handlers d'erreur Fastify
 */
export function setupErrorHandlers(fastify: FastifyInstance): void {
	// Handler pour les routes non trouvées
	fastify.setNotFoundHandler(async (request, reply) => {
		fastify.log.error({ url: request.url }, "API endpoint not found");
		reply.status(404).send({ error: "API endpoint not found" });
	});

	// Handler pour les erreurs générales
	fastify.setErrorHandler(async (error: Error & { statusCode?: number }, request, reply) => {
		fastify.log.error(error);
		reply.status(error.statusCode || 500).send({
			error: error.message || "Internal server error",
		});
	});
}


