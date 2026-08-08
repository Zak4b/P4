import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createAvatar } from "@dicebear/core";
import { create, schema } from "@dicebear/micah";
import { userIdParamSchema } from "@p4/schemas/http";
import { UserService } from "../user/user.service.js";

const micahStyle = { create, schema };

/**
 * Route publique, hors préfixe `/api` et hors auth : c'est une image (`<img src>`), pas un
 * endpoint JSON. Pas de header de cache pour cette itération (Cache-Control / ETag viendront
 * dans une passe dédiée) — le SVG est régénéré à chaque requête à partir des options stockées.
 */
export const avatarSvgRoutes: FastifyPluginAsyncZod = async (fastify) => {
	fastify.get(
		"/avatars/:userId.svg",
		{
			schema: {
				operationId: "getAvatarSvg",
				summary: "SVG d'avatar régénéré à la volée à partir de la configuration stockée",
				params: userIdParamSchema,
			},
		},
		async (request, reply) => {
			const { userId } = request.params;
			const config = await UserService.getAvatarConfig(userId);

			// Pas de config enregistrée (ou utilisateur inconnu) : avatar par défaut, seedé sur l'id
			// — comportement de fallback DiceBear standard.
			const options =
				config?.avatarOptions && typeof config.avatarOptions === "object"
					? (config.avatarOptions as Record<string, unknown>)
					: { seed: userId };

			const svg = createAvatar(micahStyle, options as Record<string, string | number>).toString();

			reply.header("Content-Type", "image/svg+xml").send(svg);
		},
	);
};
