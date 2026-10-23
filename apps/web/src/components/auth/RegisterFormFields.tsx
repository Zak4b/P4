"use client";

import { Input } from "@/components/ui";
import PasswordInput from "../PasswordInput";
import { passwordRules } from "@/lib/passwordRules";
import { spacing } from "@/lib/styles";

export interface RegisterFormValues {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
}

interface RegisterFormFieldsProps {
	values: RegisterFormValues;
	disabled: boolean;
	onChange: (field: keyof RegisterFormValues, value: string) => void;
}

export default function RegisterFormFields({ values, disabled, onChange }: RegisterFormFieldsProps) {
	return (
		<>
			<Input
				fullWidth
				label="Pseudo"
				type="text"
				value={values.username}
				onChange={(e) => onChange("username", e.target.value)}
				required
				disabled={disabled}
				autoComplete="username"
				helperText="3 à 20 caractères : lettres, chiffres, _ , - , ."
				margin="normal"
				sx={spacing.mb2}
			/>
			<Input
				fullWidth
				label="Email"
				type="email"
				value={values.email}
				onChange={(e) => onChange("email", e.target.value)}
				required
				disabled={disabled}
				autoComplete="email"
				margin="normal"
				sx={spacing.mb2}
			/>
			<PasswordInput
				label="Mot de passe"
				value={values.password}
				onChange={(e) => onChange("password", e.target.value)}
				required
				disabled={disabled}
				autoComplete="new-password"
				fullWidth
				margin="normal"
				validations={passwordRules}
			/>
			<PasswordInput
				label="Confirmer le mot de passe"
				value={values.confirmPassword}
				onChange={(e) => onChange("confirmPassword", e.target.value)}
				required
				disabled={disabled}
				autoComplete="new-password"
				fullWidth
				margin="normal"
			/>
		</>
	);
}
