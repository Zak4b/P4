import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { AuthService } from "./auth.service.js";
import { cookieName } from "./request-auth.js";
import { loginSchema, registerSchema } from "@p4/schemas/auth";
import { userSchema } from "@p4/schemas/user";
import {
	badRequestSchema,
	conflictSchema,
	unauthorizedSchema,
	serviceUnavailableSchema,
	noContentSchema,
} from "@p4/schemas/http";
import { ENV } from "../../config/env.js";
import { TAGS } from "../../config/api-tags.js";

const COOKIE_OPTS = {
	signed: false,
	httpOnly: true,
	secure: ENV.nodeEnv === "production",
	sameSite: "lax",
	path: "/",
} as const;

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 jours

const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

export const authRoutes: FastifyPluginAsyncZod = async (fastify) => {
	// Inscription
	fastify.post(
		"/register",
		{
			schema: {
				operationId: "register",
				tags: [TAGS.auth],
				summary: "Créer un compte",
				security: [],
				body: registerSchema,
				response: {
					201: userSchema,
					400: badRequestSchema,
					409: conflictSchema,
				},
			},
		},
		async (request, reply) => {
			const { login, email, password } = request.body;

			const result = await AuthService.register(login, email, password);

			reply.status(201).send(result.user);
		},
	);

	// Connexion (email/password)
	fastify.post(
		"/login",
		{
			schema: {
				operationId: "login",
				tags: [TAGS.auth],
				summary: "Ouvrir une session (email/password)",
				security: [],
				body: loginSchema,
				response: {
					200: userSchema,
					400: badRequestSchema,
					401: unauthorizedSchema,
				},
			},
		},
		async (request, reply) => {
			const { email, password } = request.body;

			const result = await AuthService.login(email, password);

			reply.setCookie(cookieName, result.token, {
				...COOKIE_OPTS,
				maxAge: COOKIE_MAX_AGE,
			});

			reply.status(200).send(result.user);
		},
	);

	fastify.get(
		"/google",
		{
			schema: {
				hide: true,
				operationId: "googleLogin",
				tags: [TAGS.auth],
				summary: "Rediriger vers l'autorisation Google",
				security: [],
				response: {
					503: serviceUnavailableSchema,
				},
			},
		},
		async (request, reply) => {
			const googleOAuth2 = fastify.googleOAuth2;
			if (!googleOAuth2) {
				return reply.status(503).send({ error: "Google login is not configured" });
			}
			const authorizationUri = await googleOAuth2.generateAuthorizationUri(request, reply);
			return reply.redirect(authorizationUri);
		},
	);

	// Callback Google OAuth
	fastify.get(
		"/google/callback",
		{
			schema: {
				hide: true,
				operationId: "googleCallback",
				tags: [TAGS.auth],
				summary: "Callback Google OAuth",
				security: [],
			},
		},
		async (request, reply) => {
			const googleOAuth2 = fastify.googleOAuth2;
			if (!googleOAuth2) {
				return reply.redirect(`${ENV.web.url}/login?error=Google+login+not+configured`);
			}

			try {
				const { token } = await googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
				const accessToken = token.access_token;

				const userinfoRes = await fetch(GOOGLE_USERINFO_URL, {
					headers: { Authorization: `Bearer ${accessToken}` },
				});
				if (!userinfoRes.ok) {
					throw new Error("Failed to fetch Google user info");
				}
				const profile = (await userinfoRes.json()) as {
					id: string;
					email?: string;
					name?: string;
				};

				const email = profile.email;
				if (!email) {
					return reply.redirect(`${ENV.web.url}/login?error=No+email+from+Google`);
				}

				const result = await AuthService.loginWithGoogle(profile.id, email, profile.name || "");

				reply
					.setCookie(cookieName, result.token, { ...COOKIE_OPTS, maxAge: COOKIE_MAX_AGE })
					.redirect(`${ENV.web.url}/play`);
			} catch {
				reply.redirect(`${ENV.web.url}/login?error=google_auth_failed`);
			}
		},
	);

	fastify.post(
		"/logout",
		{
			schema: {
				operationId: "logout",
				tags: [TAGS.auth],
				summary: "Fermer la session",
				security: [],
				response: {
					204: noContentSchema,
				},
			},
		},
		async (_request, reply) => {
			reply.clearCookie(cookieName, COOKIE_OPTS);
			reply.status(204).send();
		},
	);
};
