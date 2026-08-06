import { z } from "zod";

export const authUserSchema = z.object({
	id: z.string(),
	login: z.string(),
	email: z.string(),
});

export const registerSchema = z.object({
	login: z.string().min(1).max(40),
	email: z.email().transform((email) => email.toLowerCase()),
	password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
	email: z.string(),
	password: z.string().min(1),
});

export const sessionStatusSchema = z.object({
	user: authUserSchema.nullable(),
});

export type AuthUser = z.infer<typeof authUserSchema>;

export type RegisterBody = z.infer<typeof registerSchema>;

export type RegisterInput = z.input<typeof registerSchema>;
export type LoginBody = z.infer<typeof loginSchema>;
export type SessionStatus = z.infer<typeof sessionStatusSchema>;
