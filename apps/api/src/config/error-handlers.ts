import type { FastifyInstance } from "fastify";
import { HttpError } from "../lib/HttpError.js";

export function setupErrorHandlers(fastify: FastifyInstance): void {
	fastify.setNotFoundHandler(async (request, reply) => {
		fastify.log.error({ url: request.url }, "API endpoint not found");
		reply.status(404).send({ error: "API endpoint not found" });
	});

	fastify.setErrorHandler(async (error: Error & { statusCode?: number }, request, reply) => {
		if (error instanceof HttpError) {
			fastify.log.error({ statusCode: error.statusCode, message: error.message }, "HttpError");
			return reply.status(error.statusCode).send({
				error: error.message,
			});
		}

		const statusCode = error.statusCode || 500;
		const message = error.message || "Internal server error";
		
		fastify.log.error({ statusCode, message, stack: error.stack }, "Error");
		
		return reply.status(statusCode).send({
			error: message,
		});
	});
}