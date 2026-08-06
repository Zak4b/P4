import { z } from "zod";

export const errorResponseSchema = z.object({
	error: z.string(),
});

// status 400
export const validationErrorResponseSchema = z.object({
	error: z.string(),
	issues: z.unknown().optional(),
});

// status 204
export const noContentSchema = z.undefined();

// login | uuid
export const identifierParamsSchema = z.object({
	identifier: z.string().min(1).max(64),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type ValidationErrorResponse = z.infer<typeof validationErrorResponseSchema>;
export type IdentifierParams = z.infer<typeof identifierParamsSchema>;
