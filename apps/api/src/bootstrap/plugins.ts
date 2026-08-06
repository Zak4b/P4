import type { FastifyInstance } from "fastify";
import { registerCors } from "./plugins/cors.plugin.js";
import { registerCookie } from "./plugins/cookie.plugin.js";
import { registerOAuth2 } from "./plugins/oauth2.plugin.js";
import { registerUserContext } from "./plugins/user-context.plugin.js";
import { registerErrorHandlers } from "./plugins/error-handlers.plugin.js";
import { registerSocketIO } from "./plugins/socket-io.plugin.js";
import { registerZodTypeProvider } from "./plugins/zod.plugin.js";

/** Point d'entrée unique : tout ce qui prépare l'instance Fastify avant l'enregistrement des routes. */
export async function registerPlugins(fastify: FastifyInstance): Promise<void> {
	registerZodTypeProvider(fastify);
	await registerCors(fastify);
	await registerCookie(fastify);
	await registerOAuth2(fastify);
	registerUserContext(fastify);
	registerErrorHandlers(fastify);
	registerSocketIO(fastify);
}
