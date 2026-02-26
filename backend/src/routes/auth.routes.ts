import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import auth from "../services/auth.service.js";
import { registerSchema, loginSchema } from "../lib/zod-schemas.js";
import { HttpError } from "../lib/HttpError.js";
import { env } from "../config/env.js";

const COOKIE_OPTS = {
	signed: false,
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax",
	path: "/",
} as const;

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 jours

const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

export function authRoutes(fastify: FastifyInstance) {
	// Inscription
	fastify.post("/register", async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const { login, email, password } = registerSchema.parse(request.body);

			const result = await auth.register(login, email, password);

			reply.status(201).send({
				success: true,
				message: "Registration successful",
				user: result.user,
			});
		} catch (error) {
			if (error instanceof Error && error.message === "Email already exists") {
				throw HttpError.conflict(error.message);
			}
			throw error;
		}
	});

	// Connexion (email/password)
	fastify.post("/login", async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const { email, password } = loginSchema.parse(request.body);

			const result = await auth.login(email, password);

			reply.setCookie(auth.cookieName, result.token, {
				...COOKIE_OPTS,
				maxAge: COOKIE_MAX_AGE,
			});

			reply.status(200).send({
				success: true,
				message: "Login successful",
				user: result.user,
			});
		} catch (error) {
			if (error instanceof Error && error.message === "Invalid email or password") {
				throw HttpError.unauthorized(error.message);
			}
			throw error;
		}
	});

	fastify.get("/google", async (request: FastifyRequest, reply: FastifyReply) => {
		const googleOAuth2 = fastify.googleOAuth2;
		if (!googleOAuth2) {
			return reply.status(503).send({ error: "Google login is not configured" });
		}
		const authorizationUri = await googleOAuth2.generateAuthorizationUri(request, reply);
		return reply.redirect(authorizationUri);
	});

	// Callback Google OAuth
	fastify.get("/google/callback", async (request: FastifyRequest, reply: FastifyReply) => {
		const googleOAuth2 = fastify.googleOAuth2;
		if (!googleOAuth2) {
			return reply.redirect(`${env.frontend.url}/login?error=Google+login+not+configured`);
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
				return reply.redirect(`${env.frontend.url}/login?error=No+email+from+Google`);
			}

			const result = await auth.loginWithGoogle(profile.id, email, profile.name || "");

			reply.setCookie(auth.cookieName, result.token, { ...COOKIE_OPTS, maxAge: COOKIE_MAX_AGE }).redirect(`${env.frontend.url}/play`);
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Google authentication failed";
			reply.redirect(`${env.frontend.url}/login?error=${encodeURIComponent(msg)}`);
		}
	});

	// Statut de connexion
	fastify.get("/status", async (request: FastifyRequest, reply: FastifyReply) => {
		reply.send({
			isLoggedIn: request.user ? true : false,
			user: request.user ?? null,
		});
	});

	// Déconnexion
	fastify.post("/logout", async (request: FastifyRequest, reply: FastifyReply) => {
		reply.clearCookie(auth.cookieName, COOKIE_OPTS);
		reply.send({ success: true, message: "Logout successful" });
	});
}
