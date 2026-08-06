import type { FastifyInstance } from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

/**
 * Branche Zod comme type provider de Fastify.
 *
 * - `validatorCompiler` : valide body / querystring / params / headers à partir des schémas Zod
 *   déclarés dans `schema` sur chaque route (les erreurs remontent au `setErrorHandler`).
 * - `serializerCompiler` : sérialise la réponse via le schéma déclaré pour le code de statut,
 *   ce qui garantit qu'aucun champ non déclaré (mot de passe, colonne interne...) ne fuite.
 *
 * Doit être enregistré avant les routes pour que celles-ci en héritent.
 */
export function registerZodTypeProvider(fastify: FastifyInstance): void {
	fastify.setValidatorCompiler(validatorCompiler);
	fastify.setSerializerCompiler(serializerCompiler);
}
