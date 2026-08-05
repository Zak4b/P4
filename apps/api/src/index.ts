import dotenv from "dotenv";
dotenv.config();

import Fastify from "fastify";
import { ENV } from "./config/env.js";
import { registerPlugins } from "./config/plugins.js";
import { registerOAuth2 } from "./config/oauth2.js";
import { setupSocketIO } from "./config/socket.js";
import { setupErrorHandlers } from "./config/error-handlers.js";
import { routes } from "./routes/routes.js";

const fastify = Fastify({
	logger: {
		level: ENV.nodeEnv === "production" ? "info" : "debug",
	},
});

await registerPlugins(fastify);
await registerOAuth2(fastify);

setupSocketIO(fastify);

await fastify.register(routes, { prefix: "/api" });

setupErrorHandlers(fastify);

try {
	await fastify.listen({
		host: ENV.server.host,
		port: ENV.server.port,
	});
	fastify.log.info(`Backend API server running on ${ENV.server.host}:${ENV.server.port}`);
} catch (err) {
	fastify.log.error(err);
	process.exit(1);
}
