import type { FastifyInstance } from "fastify";
import { attachUserDecorator } from "../../modules/auth/user-decorator.js";

/** Résout l'utilisateur depuis le cookie de session et l'attache à `request.user` sur chaque requête. */
export function registerUserContext(fastify: FastifyInstance): void {
	fastify.addHook("onRequest", attachUserDecorator);
}
