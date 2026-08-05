import type { FastifyInstance } from "fastify";
import { env } from "./env.js";
import { getCorsOptions } from "./cors.js";
import { attachUserDecorator } from "../lib/user-decorator.js";

export async function registerPlugins(fastify: FastifyInstance): Promise<void> {
	await fastify.register(import("@fastify/cors"), getCorsOptions());
	
	await fastify.register(import("@fastify/cookie"), {
		secret: env.jwt.secret,
		parseOptions: {},
	});

	fastify.addHook("onRequest", attachUserDecorator);
}
