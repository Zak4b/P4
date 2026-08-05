import { ValidationRule } from "@/components/PasswordInput";

export const passwordRules: ValidationRule[] = [
	[(v: string) => v.length >= 8, "Minimum 8 characters"],
	[(v: string) => /[A-Z]/.test(v), "At least one uppercase letter"],
	[(v: string) => /[a-z]/.test(v), "At least one lowercase letter"],
	[(v: string) => /[0-9]/.test(v), "At least one number"],
];