import type { ValidationRule } from "@/components/PasswordInput";

export const passwordRules: ValidationRule[] = [
	[(v: string) => v.length >= 8, "8 caractères minimum"],
	[(v: string) => /[A-Z]/.test(v), "Au moins une majuscule"],
	[(v: string) => /[a-z]/.test(v), "Au moins une minuscule"],
	[(v: string) => /[0-9]/.test(v), "Au moins un chiffre"],
];