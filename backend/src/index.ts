import dotenv from "dotenv";
dotenv.config();

import Fastify from "fastify";
import { env } from "./config/env.js";
import { registerPlugins } from "./config/plugins.js";
import { setupSocketIO } from "./config/socket.js";
import { setupErrorHandlers } from "./config/error-handlers.js";
import { routes } from "./routes/routes.js";

const fastify = Fastify({
	logger: {
		level: process.env.NODE_ENV === "production" ? "info" : "debug",
	},
});

await registerPlugins(fastify);

setupSocketIO(fastify);

await fastify.register(routes, { prefix: "/P4" });

setupErrorHandlers(fastify);

try {
	await fastify.listen({ 
		port: env.server.port, 
		host: env.server.ip 
	});
	fastify.log.info(`Backend API server running on ${env.server.ip}:${env.server.port}`);
} catch (err) {
	fastify.log.error(err);
	process.exit(1);
}
