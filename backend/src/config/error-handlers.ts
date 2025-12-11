import type { FastifyInstance } from "fastify";

export function setupErrorHandlers(fastify: FastifyInstance): void {
	fastify.setNotFoundHandler(async (request, reply) => {
		fastify.log.error({ url: request.url }, "API endpoint not found");
		reply.status(404).send({ error: "API endpoint not found" });
	});

	fastify.setErrorHandler(async (error: Error & { statusCode?: number }, request, reply) => {
		fastify.log.error(error);
		reply.status(error.statusCode || 500).send({
			error: error.message || "Internal server error",
		});
	});
}