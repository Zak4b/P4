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
