import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { UserService } from "./user.service.js";
import { HttpError } from "../../lib/HttpError.js";
import {
	leaderboardEntrySchema,
	safeUserSchema,
	userIdParamsSchema,
	userProfileSchema,
	userRankingEntrySchema,
	userStatsSchema,
} from "./user.schemas.js";
import { errorResponseSchema, identifierParamsSchema, validationErrorResponseSchema } from "../../lib/http-schemas.js";

export const userRoutes: FastifyPluginAsyncZod = async (fastify) => {
	fastify.get(
		"/",
		{
			schema: {
				response: {
					200: z.array(userRankingEntrySchema),
				},
			},
		},
		async (_request, reply) => {
			const users = await UserService.listAll();
			reply.send(users);
		},
	);

	// Routes statiques avant les paramétriques pour éviter les conflits
	fastify.get(
		"/leaderboard",
		{
			schema: {
				response: {
					200: z.array(leaderboardEntrySchema),
				},
			},
		},
		async (_request, reply) => {
			const leaderboard = await UserService.getLeaderboard(10);
			reply.send(leaderboard);
		},
	);

	// Profil complet d'un joueur (id ou login)
	fastify.get(
		"/profile/:identifier",
		{
			schema: {
				params: identifierParamsSchema,
				response: {
					200: userProfileSchema,
					400: validationErrorResponseSchema,
					404: errorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { identifier } = request.params;
			const profile = await UserService.getProfile(identifier);
			if (!profile) {
				throw HttpError.notFound("User not found");
			}
			reply.send(profile);
		},
	);

	// Informations de base (id ou login) - sans mot de passe
	fastify.get(
		"/:id",
		{
			schema: {
				params: userIdParamsSchema,
				response: {
					200: safeUserSchema,
					400: validationErrorResponseSchema,
					404: errorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params;
			const user = await UserService.getByIdOrLogin(id);
			if (!user) {
				throw HttpError.notFound("User not found");
			}
			const { password: _p, ...safeUser } = user;
			reply.send(safeUser);
		},
	);

	// Statistiques (id ou login)
	fastify.get(
		"/:id/stats",
		{
			schema: {
				params: userIdParamsSchema,
				response: {
					200: userStatsSchema,
					400: validationErrorResponseSchema,
					404: errorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params;
			const user = await UserService.getByIdOrLogin(id);
			if (!user) {
				throw HttpError.notFound("User not found");
			}
			const stats = await UserService.getStats(user.id);
			if (!stats) {
				throw HttpError.notFound("User not found");
			}
			reply.send(stats);
		},
	);
};
