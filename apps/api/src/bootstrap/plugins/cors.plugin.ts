import type { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import { getCorsOptions } from "../../config/cors.js";

export async function registerCors(fastify: FastifyInstance): Promise<void> {
	await fastify.register(fastifyCors, getCorsOptions());
}
