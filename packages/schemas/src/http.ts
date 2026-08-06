import { z } from "zod";

export const errorResponse = (example: string) =>
	z.object({
		error: z.string().meta({ example }),
		issues: z.unknown().optional(),
	});

export const badRequestSchema = errorResponse("Invalid request");
export const unauthorizedSchema = errorResponse("Authentication required");
export const forbiddenSchema = errorResponse("Not allowed");
export const notFoundSchema = errorResponse("Resource not found");
export const conflictSchema = errorResponse("Resource already exists");
export const serviceUnavailableSchema = errorResponse("Service is not configured");

export const errorResponseSchema = errorResponse("Unexpected error");

const pathId = (field: string, example: string) => z.string().min(1, `${field} param is required`).meta({ example });

export const idParamSchema = z.object({
	id: pathId("id", "16fd2706-8baf-433b-82eb-8c7fada847da"),
});

export const userPathIdSchema = z.object({
	id: pathId("id", "f47ac10b-58cc-4372-a567-0e02b2c3d479"),
});

export const userIdParamSchema = z.object({
	userId: pathId("userId", "f47ac10b-58cc-4372-a567-0e02b2c3d479"),
});

// status 204
export const noContentSchema = z.undefined();

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type IdParam = z.infer<typeof idParamSchema>;
export type UserPathId = z.infer<typeof userPathIdSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
