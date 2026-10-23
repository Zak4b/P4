import { z } from "zod";
import { userSchema } from "./user.js";

export const userIdentitySchema = userSchema.pick({ id: true, username: true });

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;
export const USERNAME_PATTERN = /^[a-zA-Z0-9_.-]+$/;

/**
 * Pseudo public : ASCII restreint pour empêcher les homoglyphes (« а » cyrillique),
 * les caractères invisibles et les pseudos faits d'espaces.
 */
export const usernameField = z
	.string()
	.trim()
	.min(USERNAME_MIN_LENGTH, `${USERNAME_MIN_LENGTH} caractères minimum`)
	.max(USERNAME_MAX_LENGTH, `${USERNAME_MAX_LENGTH} caractères maximum`)
	.regex(USERNAME_PATTERN, "Lettres, chiffres, « _ », « - » et « . » uniquement")
	.meta({ example: "alice" });

export const emailField = z
	.email("Format d'email invalide")
	.transform((email) => email.toLowerCase())
	.meta({ example: "alice@example.com" });

export const passwordField = z
	.string()
	.min(8, "8 caractères minimum")
	.max(100, "100 caractères maximum")
	.meta({ example: "MotDePasse123!" });

export const registerSchema = z.object({
	username: usernameField,
	email: emailField,
	password: passwordField,
});

export const loginSchema = z.object({
	email: z.string().meta({ example: "alice@example.com" }),
	password: z.string().min(1).meta({ example: "MotDePasse123!" }),
});

export const updateUsernameSchema = z.object({
	username: usernameField,
});

export const updateEmailSchema = z.object({
	email: emailField,
	currentPassword: z.string().min(1).meta({ example: "MotDePasse123!" }),
});

export const updatePasswordSchema = z.object({
	currentPassword: z.string().min(1).meta({ example: "MotDePasse123!" }),
	newPassword: passwordField,
});

export type UserIdentity = z.infer<typeof userIdentitySchema>;
export type RegisterBody = z.infer<typeof registerSchema>;
export type RegisterInput = z.input<typeof registerSchema>;
export type LoginBody = z.infer<typeof loginSchema>;
export type UpdateUsernameBody = z.infer<typeof updateUsernameSchema>;
export type UpdateEmailBody = z.infer<typeof updateEmailSchema>;
export type UpdatePasswordBody = z.infer<typeof updatePasswordSchema>;
