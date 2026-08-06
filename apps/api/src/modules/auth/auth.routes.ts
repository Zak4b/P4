import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { AuthService } from "./auth.service.js";
import { cookieName } from "./request-auth.js";
import { authUserSchema, loginSchema, registerSchema, sessionStatusSchema } from "@p4/schemas/auth";
import { errorResponseSchema, noContentSchema, validationErrorResponseSchema } from "@p4/schemas/http";
import { ENV } from "../../config/env.js";

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
				body: registerSchema,
				response: {
					201: authUserSchema,
					400: validationErrorResponseSchema,
					409: errorResponseSchema,
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
				body: loginSchema,
				response: {
					200: authUserSchema,
					400: validationErrorResponseSchema,
					401: errorResponseSchema,
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
				response: {
					503: errorResponseSchema,
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
	fastify.get("/google/callback", async (request, reply) => {
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
			const profile = (await userinfoRes.json()) as { id: string; email?: string; name?: string };

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
	});

	// État de la session courante — route publique : « personne » est une réponse valide, pas une erreur
	fastify.get(
		"/status",
		{
			schema: {
				response: {
					200: sessionStatusSchema,
				},
			},
		},
		async (request, reply) => {
			reply.send({ user: request.user ?? null });
		},
	);

	fastify.post(
		"/logout",
		{
			schema: {
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
