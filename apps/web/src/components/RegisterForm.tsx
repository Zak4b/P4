"use client";

import React, { useState } from "react";
import { Alert, CircularProgress } from "@mui/material";
import { Button } from "@/components/ui";
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
		return "Tous les champs sont obligatoires";
	}
	if (password.length < 8) {
		return "Le mot de passe doit contenir au moins 8 caractères";
	}
	if (password !== confirmPassword) {
		return "Les mots de passe ne correspondent pas";
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
			setError(err instanceof Error ? err.message : "L'inscription a échoué");
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
		<AuthCard title="Créer un compte P4" large>
			<form onSubmit={handleSubmit}>
				<RegisterFormFields values={values} disabled={isLoading} onChange={updateValue} />
				<Button
					type="submit"
					fullWidth
					disabled={isLoading || isIncomplete}
					startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
					sx={[buttonStyles.gradientButton, spacing.mb2, { py: 1.5 }]}
				>
					{isLoading ? "Création…" : "Créer mon compte"}
				</Button>
			</form>
			{error && (
				<Alert severity="error" sx={spacing.mt2}>
					{error}
				</Alert>
			)}
			<AuthSwitchPrompt question="Déjà un compte ?" href="/login" linkLabel="Se connecter" />
		</AuthCard>
	);
};

export default RegisterForm;
