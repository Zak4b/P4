import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { UserService } from "./user.service.js";
import { HttpError } from "../../lib/HttpError.js";
import { meSchema } from "@p4/schemas/user";
import { updateEmailSchema, updatePasswordSchema, updateUsernameSchema } from "@p4/schemas/auth";
import {
	badRequestSchema,
	conflictSchema,
	forbiddenSchema,
	noContentSchema,
	unauthorizedSchema,
} from "@p4/schemas/http";
import { TAGS } from "../../config/api-tags.js";

export const meRoutes: FastifyPluginAsyncZod = async (fastify) => {
	fastify.get(
		"/",
		{
			prefixTrailingSlash: "no-slash",
			schema: {
				operationId: "getMe",
				tags: [TAGS.me],
				summary: "Profil du joueur authentifié",
				response: {
					200: meSchema,
					401: unauthorizedSchema,
				},
			},
		},
		async (request, reply) => {
			const currentUser = request.user;
			if (!currentUser) {
				throw HttpError.unauthorized("Authentication required");
			}

			const me = await UserService.getMe(currentUser.id);
			if (!me) {
				throw HttpError.unauthorized("Session user no longer exists");
			}
			reply.send(me);
		},
	);

	fastify.patch(
		"/username",
		{
			schema: {
				operationId: "updateMyUsername",
				tags: [TAGS.me],
				summary: "Changer de pseudo",
				body: updateUsernameSchema,
				response: {
					200: meSchema,
					400: badRequestSchema,
					401: unauthorizedSchema,
					409: conflictSchema,
				},
			},
		},
		async (request, reply) => {
			const currentUser = request.user;
			if (!currentUser) {
				throw HttpError.unauthorized("Authentication required");
			}

			const user = await UserService.changeUsername(currentUser.id, request.body.username);

			const me = await UserService.getMe(user.id);
			if (!me) {
				throw HttpError.unauthorized("Session user no longer exists");
			}
			reply.send(me);
		},
	);

	fastify.patch(
		"/email",
		{
			schema: {
				operationId: "updateMyEmail",
				tags: [TAGS.me],
				summary: "Changer d'email (mot de passe actuel requis)",
				body: updateEmailSchema,
				response: {
					200: meSchema,
					400: badRequestSchema,
					401: unauthorizedSchema,
					403: forbiddenSchema,
					409: conflictSchema,
				},
			},
		},
		async (request, reply) => {
			const currentUser = request.user;
			if (!currentUser) {
				throw HttpError.unauthorized("Authentication required");
			}

			const { email, currentPassword } = request.body;
			const user = await UserService.changeEmail(currentUser.id, email, currentPassword);

			const me = await UserService.getMe(user.id);
			if (!me) {
				throw HttpError.unauthorized("Session user no longer exists");
			}
			reply.send(me);
		},
	);

	fastify.patch(
		"/password",
		{
			schema: {
				operationId: "updateMyPassword",
				tags: [TAGS.me],
				summary: "Changer de mot de passe (mot de passe actuel requis)",
				body: updatePasswordSchema,
				response: {
					204: noContentSchema,
					400: badRequestSchema,
					401: unauthorizedSchema,
					403: forbiddenSchema,
				},
			},
		},
		async (request, reply) => {
			const currentUser = request.user;
			if (!currentUser) {
				throw HttpError.unauthorized("Authentication required");
			}

			const { currentPassword, newPassword } = request.body;
			await UserService.changePassword(currentUser.id, currentPassword, newPassword);
			reply.status(204).send();
		},
	);
};
