import type { FastifyInstance } from "fastify";
import { ENV } from "./env.js";
import { getCorsOptions } from "./cors.js";
import { attachUserDecorator } from "../modules/auth/user-decorator.js";

export async function registerPlugins(fastify: FastifyInstance): Promise<void> {
	await fastify.register(import("@fastify/cors"), getCorsOptions());

	await fastify.register(import("@fastify/cookie"), {
		secret: ENV.api.jwt.secret,
		parseOptions: {},
	});

	fastify.addHook("onRequest", attachUserDecorator);
}
