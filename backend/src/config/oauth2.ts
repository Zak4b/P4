import type { FastifyInstance } from "fastify";
import fastifyOAuth2 from "@fastify/oauth2";
import { env } from "./env.js";

const GOOGLE_AUTH_CONFIG = {
	authorizeHost: "https://accounts.google.com",
	authorizePath: "/o/oauth2/v2/auth",
	tokenHost: "https://www.googleapis.com",
	tokenPath: "/oauth2/v4/token",
};

export async function registerOAuth2(fastify: FastifyInstance): Promise<void> {
	if (!env.google.clientId || !env.google.clientSecret) {
		fastify.log.info("Google OAuth2 not configured (missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET)");
		return;
	}

	const callbackUri = `${env.backend.url}/api/auth/google/callback`;

	await fastify.register(fastifyOAuth2, {
		name: "googleOAuth2",
		scope: ["profile", "email"],
		credentials: {
			client: {
				id: env.google.clientId,
				secret: env.google.clientSecret,
			},
			auth: GOOGLE_AUTH_CONFIG,
		},
		callbackUri,
		pkce: "S256",
	});
}
