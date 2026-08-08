import Fastify from "fastify";
import { ENV } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { registerPlugins } from "./bootstrap/plugins.js";
import { routes } from "./bootstrap/routes.js";
import { avatarSvgRoutes } from "./modules/avatar/avatar-svg.routes.js";

const fastify = Fastify({ loggerInstance: logger });

await registerPlugins(fastify);

await fastify.register(routes, { prefix: "/api" });

await fastify.register(avatarSvgRoutes);

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
