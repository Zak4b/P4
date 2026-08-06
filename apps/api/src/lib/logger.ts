import pino from "pino";
import type { FastifyBaseLogger } from "fastify";
import { ENV } from "../config/env.js";

/**
 * Logger partagé : passé à Fastify (`loggerInstance`) et utilisable depuis les
 * couches qui n'ont pas accès à l'instance Fastify (moteur de jeu, temps réel).
 */
export const logger: FastifyBaseLogger = pino({
	level: ENV.nodeEnv === "production" ? "info" : "debug",
});
