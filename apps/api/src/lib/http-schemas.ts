import { z } from "zod";

export const errorResponseSchema = z.object({
	error: z.string(),
});

// status 400
export const validationErrorResponseSchema = z.object({
	error: z.string(),
	issues: z.unknown().optional(),
});

// status 204 — `z.undefined()` est la forme recommandée par fastify-type-provider-zod
// pour une réponse sans corps : `reply.status(204).send()` suffit.
export const noContentSchema = z.undefined();

// login | uuid
export const identifierParamsSchema = z.object({
	identifier: z.string().min(1).max(64),
});
