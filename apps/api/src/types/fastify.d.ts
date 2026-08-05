import type { JWTPayload } from "../lib/jwt.js";
import type { OAuth2Namespace } from "@fastify/oauth2";

declare module "fastify" {
	interface FastifyRequest {
		user?: JWTPayload;
	}
	interface FastifyInstance {
		googleOAuth2?: OAuth2Namespace;
	}
}

