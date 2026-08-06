import { z } from "zod";
import { userSchema } from "./user.js";

export const userIdentitySchema = userSchema.pick({ id: true, login: true });

export const registerSchema = z.object({
	login: z.string().min(1).max(40).meta({ example: "alice" }),
	email: z
		.email()
		.transform((email) => email.toLowerCase())
		.meta({ example: "alice@example.com" }),
	password: z.string().min(8).max(100).meta({ example: "MotDePasse123!" }),
});

export const loginSchema = z.object({
	email: z.string().meta({ example: "alice@example.com" }),
	password: z.string().min(1).meta({ example: "MotDePasse123!" }),
});

export type UserIdentity = z.infer<typeof userIdentitySchema>;
export type RegisterBody = z.infer<typeof registerSchema>;
export type RegisterInput = z.input<typeof registerSchema>;
export type LoginBody = z.infer<typeof loginSchema>;
