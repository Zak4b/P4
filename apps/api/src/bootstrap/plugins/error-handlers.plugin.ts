import type { FastifyError, FastifyInstance } from "fastify";
import { hasZodFastifySchemaValidationErrors, isResponseSerializationError } from "fastify-type-provider-zod";
import { HttpError } from "../../lib/HttpError.js";
import { Prisma } from "../../generated/prisma/client.js";

/**
 * Champ en cause d'une violation d'unicité. Avec l'adapter MariaDB, Prisma ne renseigne pas
 * `meta.target` mais le nom de l'index (`User_username_key`), dont on extrait le champ.
 */
function uniqueViolationField(error: Prisma.PrismaClientKnownRequestError): string | null {
	const meta = error.meta as
		| { driverAdapterError?: { cause?: { constraint?: { index?: string; fields?: string[] } } } }
		| undefined;
	const constraint = meta?.driverAdapterError?.cause?.constraint;
	if (constraint?.fields?.[0]) {
		return constraint.fields[0];
	}
	const match = constraint?.index ? /^[^_]+_(.+)_key$/.exec(constraint.index) : null;
	return match?.[1] ?? null;
}

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

		// Contrainte d'unicité violée (pseudo déjà pris, doublon concurrent…)
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
			request.log.warn({ err: error }, "Unique constraint violation");
			const field = uniqueViolationField(error);
			const label = field ? `${field.charAt(0).toUpperCase()}${field.slice(1)}` : "Resource";
			return reply.status(409).send({ error: `${label} already exists` });
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
