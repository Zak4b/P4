"use client";

import { TextField } from "@mui/material";
import PasswordInput from "../PasswordInput";
import { passwordRules } from "@/lib/passwordRules";
import { spacing } from "@/lib/styles";

export interface RegisterFormValues {
	login: string;
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
			<TextField
				fullWidth
				label="Login"
				type="text"
				value={values.login}
				onChange={(e) => onChange("login", e.target.value)}
				required
				disabled={disabled}
				autoComplete="username"
				margin="normal"
				variant="outlined"
				sx={spacing.mb2}
			/>
			<TextField
				fullWidth
				label="Email"
				type="email"
				value={values.email}
				onChange={(e) => onChange("email", e.target.value)}
				required
				disabled={disabled}
				autoComplete="email"
				margin="normal"
				variant="outlined"
				sx={spacing.mb2}
			/>
			<PasswordInput
				label="Password"
				value={values.password}
				onChange={(e) => onChange("password", e.target.value)}
				required
				disabled={disabled}
				autoComplete="new-password"
				fullWidth
				margin="normal"
				variant="outlined"
				validations={passwordRules}
			/>
			<PasswordInput
				label="Confirm Password"
				value={values.confirmPassword}
				onChange={(e) => onChange("confirmPassword", e.target.value)}
				required
				disabled={disabled}
				autoComplete="new-password"
				fullWidth
				margin="normal"
				variant="outlined"
			/>
		</>
	);
}
