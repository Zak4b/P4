import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import type { FastifyInstance } from "fastify";
import { jsonSchemaTransform, jsonSchemaTransformObject } from "fastify-type-provider-zod";
import { ENV } from "../../config/env.js";
import { tagDefinitions } from "../../config/api-tags.js";
import { cookieName } from "../../modules/auth/request-auth.js";

/**
 * `z.int()` borne les entiers aux limites du safe integer JS. Ce n'est pas une
 * contrainte métier, et Swagger UI s'en sert comme valeur d'exemple à défaut
 * d'`example` : on les retire du document pour ne documenter que le vrai contrat.
 */
function stripSafeIntegerBounds(node: unknown): void {
	if (Array.isArray(node)) {
		for (const item of node) {
			stripSafeIntegerBounds(item);
		}
		return;
	}
	if (typeof node !== "object" || node === null) {
		return;
	}

	const schema = node as Record<string, unknown>;
	if (schema.type === "integer") {
		if (schema.minimum === -Number.MAX_SAFE_INTEGER) {
			delete schema.minimum;
		}
		if (schema.maximum === Number.MAX_SAFE_INTEGER) {
			delete schema.maximum;
		}
	}
	for (const value of Object.values(schema)) {
		stripSafeIntegerBounds(value);
	}
}

export async function registerSwagger(fastify: FastifyInstance): Promise<void> {
	if (!ENV.api.docs.enabled) {
		return;
	}

	await fastify.register(fastifySwagger, {
		openapi: {
			openapi: "3.1.0",
			info: {
				title: "API",
				version: "1.0.0",
			},
			servers: [{ url: ENV.api.url }],
			tags: tagDefinitions,
			components: {
				securitySchemes: {
					cookieAuth: { type: "apiKey", in: "cookie", name: cookieName },
				},
			},
			security: [{ cookieAuth: [] }],
		},
		transform: jsonSchemaTransform,
		transformObject: (input) => {
			const openapiObject = jsonSchemaTransformObject(input);
			stripSafeIntegerBounds(openapiObject);
			return openapiObject;
		},
	});

	await fastify.register(fastifySwaggerUI, { routePrefix: "/documentation" });
}
