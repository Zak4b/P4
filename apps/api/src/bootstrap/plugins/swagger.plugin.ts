import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import type { FastifyInstance } from "fastify";
import { jsonSchemaTransform, jsonSchemaTransformObject } from "fastify-type-provider-zod";
import { ENV } from "../../config/env.js";
import { cookieName } from "../../modules/auth/request-auth.js";

export async function registerSwagger(fastify: FastifyInstance): Promise<void> {
	if (!ENV.api.docs.enabled) return;

	await fastify.register(fastifySwagger, {
		openapi: {
			openapi: "3.1.0",
			info: {
				title: "API",
				version: "1.0.0",
			},
			servers: [{ url: ENV.api.url }],
			components: {
				securitySchemes: {
					cookieAuth: { type: "apiKey", in: "cookie", name: cookieName },
				},
			},
		},
		transform: jsonSchemaTransform,
		transformObject: jsonSchemaTransformObject,
	});

	await fastify.register(fastifySwaggerUI, { routePrefix: "/documentation" });
}
