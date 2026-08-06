import type { FastifyError, FastifyInstance } from "fastify";
import { z, ZodError } from "zod";
import { HttpError } from "../../lib/HttpError.js";

export function registerErrorHandlers(fastify: FastifyInstance): void {
	fastify.setNotFoundHandler((request, reply) => {
		return reply.status(404).send({ error: "API endpoint not found" });
	});

	fastify.setErrorHandler((error: FastifyError, request, reply) => {
		if (error instanceof HttpError) {
			if (error.statusCode >= 500) {
				request.log.error({ statusCode: error.statusCode, err: error });
			} else {
				request.log.warn({ statusCode: error.statusCode, err: error });
			}
			return reply.status(error.statusCode).send({ error: error.message });
		}

		if (error instanceof ZodError) {
			request.log.warn({ err: error }, "Validation error");
			return reply.status(400).send({ error: "Validation failed", issues: z.treeifyError(error) });
		}

		request.log.error({ err: error }, "Unhandled error");
		return reply.status(500).send({ error: "Internal server error" });
	});
}
