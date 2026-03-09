import type { FastifyInstance } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

export async function setupSwagger(fastify: FastifyInstance): Promise<void> {
	await fastify.register(fastifySwagger, {
		openapi: {
			openapi: "3.0.0",
			info: {
				title: "P4 Game API",
				description: "API backend du jeu Puissance 4 en ligne.\n\nAuthentification : cookie `token` (JWT) ou header `Authorization: Bearer <token>`.",
				version: "1.0.0",
			},
			tags: [
				{ name: "auth",   description: "Authentification (login, register, OAuth)" },
				{ name: "user",   description: "Profils et statistiques" },
				{ name: "room",   description: "Gestion des salles de jeu" },
				{ name: "match",  description: "Historique des parties" },
				{ name: "friend", description: "Système d'amis" },
			],
			components: {
				securitySchemes: {
					cookieAuth: {
						type: "apiKey",
						in: "cookie",
						name: "token",
						description: "JWT stocké dans le cookie `token`",
					},
					bearerAuth: {
						type: "http",
						scheme: "bearer",
						bearerFormat: "JWT",
						description: "JWT passé en header Authorization",
					},
				},
			},
			security: [{ cookieAuth: [] }, { bearerAuth: [] }],
		},
	});

	await fastify.register(fastifySwaggerUi, {
		routePrefix: "/docs",
		uiConfig: {
			docExpansion: "list",
			deepLinking: true,
			tryItOutEnabled: true,
			layout: "BaseLayout",
		},
		staticCSP: true,
	});
}
