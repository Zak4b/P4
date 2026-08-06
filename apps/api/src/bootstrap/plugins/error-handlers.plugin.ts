import type { FastifyError, FastifyInstance } from "fastify";
import { hasZodFastifySchemaValidationErrors, isResponseSerializationError } from "fastify-type-provider-zod";
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

		// Requête refusée par le schéma Zod de la route (body, querystring, params, headers)
		if (hasZodFastifySchemaValidationErrors(error)) {
			request.log.warn({ err: error }, "Request validation error");
			return reply.status(400).send({
				error: "Validation failed",
				issues: error.validation.map((issue) => ({
					path: issue.instancePath,
					message: issue.message,
				})),
			});
		}

		// La réponse ne correspond pas au schéma déclaré : bug côté serveur, on ne fuite rien au client
		if (isResponseSerializationError(error)) {
			request.log.error(
				{ err: error, method: error.method, url: error.url, issues: error.cause.issues },
				"Response serialization error",
			);
			return reply.status(500).send({ error: "Internal server error" });
		}

		request.log.error({ err: error }, "Unhandled error");
		return reply.status(500).send({ error: "Internal server error" });
	});
}
