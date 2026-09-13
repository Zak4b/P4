"use client";

import React, { useState } from "react";
import { Alert, Button, CircularProgress } from "@mui/material";
import { PersonAdd as PersonAddIcon } from "@mui/icons-material";
import { useAuth } from "./AuthContext";
import { buttonStyles, spacing } from "@/lib/styles";
import AuthCard from "./auth/AuthCard";
import AuthSwitchPrompt from "./auth/AuthSwitchPrompt";
import RegisterFormFields, { type RegisterFormValues } from "./auth/RegisterFormFields";

interface RegisterFormProps {
	onRegister?: () => void;
}

export function validateRegistration({ login, email, password, confirmPassword }: RegisterFormValues): string | null {
	if (!login.trim() || !email.trim() || !password.trim()) {
		return "All fields are required";
	}
	if (password.length < 8) {
		return "Password must be at least 8 characters long";
	}
	if (password !== confirmPassword) {
		return "Passwords do not match";
	}
	return null;
}

const EMPTY_VALUES: RegisterFormValues = { login: "", email: "", password: "", confirmPassword: "" };

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister }) => {
	const [values, setValues] = useState<RegisterFormValues>(EMPTY_VALUES);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { register } = useAuth();

	const updateValue = (field: keyof RegisterFormValues, value: string) => {
		setValues((prev) => ({ ...prev, [field]: value }));
	};

	const submit = async () => {
		const validationError = validateRegistration(values);
		if (validationError) {
			setError(validationError);
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			await register(values.login, values.email, values.password);
			onRegister?.();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Registration failed");
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		submit().catch((err: unknown) => console.error(err));
	};

	const isIncomplete = (Object.keys(values) as (keyof RegisterFormValues)[]).some((key) => !values[key].trim());

	return (
		<AuthCard title="Register to P4 Game" large>
			<form onSubmit={handleSubmit}>
				<RegisterFormFields values={values} disabled={isLoading} onChange={updateValue} />
				<Button
					type="submit"
					variant="contained"
					fullWidth
					disabled={isLoading || isIncomplete}
					startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
					sx={[buttonStyles.gradientButton, spacing.mb2, { py: 1.5 }]}
				>
					{isLoading ? "Registering..." : "Register"}
				</Button>
			</form>
			{error && (
				<Alert severity="error" sx={spacing.mt2}>
					{error}
				</Alert>
			)}
			<AuthSwitchPrompt question="Already have an account?" href="/login" linkLabel="Login here" />
		</AuthCard>
	);
};

export default RegisterForm;
