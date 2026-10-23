import type { FastifyReply } from "fastify";
import { cookieName } from "./request-auth.js";
import { ENV } from "../../config/env.js";

const COOKIE_OPTS = {
	signed: false,
	httpOnly: true,
	secure: ENV.nodeEnv === "production",
	sameSite: "lax",
	path: "/",
} as const;

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 jours

/** Pose (ou remplace) le cookie de session contenant le JWT */
export function setSessionCookie(reply: FastifyReply, token: string): FastifyReply {
	return reply.setCookie(cookieName, token, { ...COOKIE_OPTS, maxAge: COOKIE_MAX_AGE });
}

export function clearSessionCookie(reply: FastifyReply): FastifyReply {
	return reply.clearCookie(cookieName, COOKIE_OPTS);
}
