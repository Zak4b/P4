import type { FastifyInstance } from "fastify";
import fastifyCookie from "@fastify/cookie";
import { ENV } from "../../config/env.js";

export async function registerCookie(fastify: FastifyInstance): Promise<void> {
	await fastify.register(fastifyCookie, {
		secret: ENV.api.jwt.secret,
		parseOptions: {},
	});
}
