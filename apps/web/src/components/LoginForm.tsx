"use client";

import React, { Suspense, useState } from "react";
import { Alert, Box, CircularProgress, Divider } from "@mui/material";
import { Button, Input, Muted } from "@/components/ui";
import { Login as LoginIcon } from "@mui/icons-material";
import { useSearchParams } from "next/navigation";
import { useAuth } from "./AuthContext";
import { buttonStyles, spacing } from "@/lib/styles";
import PasswordInput from "./PasswordInput";
import AuthCard from "./auth/AuthCard";
import AuthSwitchPrompt from "./auth/AuthSwitchPrompt";
import GoogleAuthButton from "./auth/GoogleAuthButton";

interface LoginFormProps {
	onLogin?: () => void;
}

function LoginFormContent({ onLogin }: LoginFormProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [submitError, setSubmitError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const searchParams = useSearchParams();
	const { login } = useAuth();

	const urlError = searchParams.get("error");
	const error = submitError || (urlError ? decodeURIComponent(urlError) : "");

	const submit = async () => {
		if (!email.trim() || !password.trim()) {
			return;
		}

		setIsLoading(true);
		setSubmitError("");

		try {
			await login(email, password);
			onLogin?.();
		} catch (err) {
			setSubmitError(err instanceof Error ? err.message : "Login failed");
			setIsLoading(false);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		submit().catch((err: unknown) => console.error(err));
	};

	return (
		<AuthCard title="Login to P4 Game">
			<form onSubmit={handleSubmit}>
				<Input
					fullWidth
					label="Email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					disabled={isLoading}
					autoComplete="email"
					margin="normal"
					sx={spacing.mb2}
				/>
				<PasswordInput
					label="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					disabled={isLoading}
					autoComplete="current-password"
					fullWidth
					margin="normal"
				/>
				<Button
					type="submit"
					fullWidth
					disabled={isLoading || !email.trim() || !password.trim()}
					startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
					sx={[buttonStyles.gradientButton, spacing.mb2, { py: 1.5 }]}
				>
					{isLoading ? "Logging in..." : "Login"}
				</Button>
				<Box sx={{ my: 2 }}>
					<Divider sx={{ "&::before, &::after": { borderColor: "divider" } }}>
						<Muted>ou</Muted>
					</Divider>
				</Box>
				<GoogleAuthButton disabled={isLoading} />
			</form>
			{error && (
				<Alert severity="error" sx={spacing.mt2}>
					{error}
				</Alert>
			)}
			<AuthSwitchPrompt question="Don't have an account?" href="/register" linkLabel="Register here" />
		</AuthCard>
	);
}

const LoginForm: React.FC<LoginFormProps> = (props) => {
	return (
		<Suspense
			fallback={
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						minHeight: "60vh",
					}}
				>
					<CircularProgress />
				</Box>
			}
		>
			<LoginFormContent {...props} />
		</Suspense>
	);
};

export default LoginForm;
