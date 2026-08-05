"use client";

import React, { Suspense, useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardHeader,
	Typography,
	TextField,
	Button,
	Alert,
	Box,
	CircularProgress,
	Divider,
} from "@mui/material";
import { Login as LoginIcon } from "@mui/icons-material";
import { useAuth } from "./AuthContext";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
	cardStyles,
	typographyStyles,
	buttonStyles,
	spacing,
} from "@/lib/styles";
import PasswordInput from "./PasswordInput";
import { apiClient } from "@/lib/api";

interface LoginFormProps {
	onLogin?: () => void;
}

function LoginFormContent({ onLogin }: LoginFormProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const searchParams = useSearchParams();
	const { login } = useAuth();

	useEffect(() => {
		const err = searchParams.get("error");
		if (err) setError(decodeURIComponent(err));
	}, [searchParams]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email.trim() || !password.trim()) return;

		setIsLoading(true);
		setError("");

		try {
			await login(email, password);
			onLogin?.();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed");
			setIsLoading(false);
		}
	};

	return (
		<Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
			<Card sx={cardStyles.authCard}>
				<CardHeader
					title={
						<Typography variant="h5" fontWeight={700} sx={typographyStyles.gradientHeading}>
							Login to P4 Game
						</Typography>
					}
					sx={{ pb: 1 }}
				/>
				<CardContent>
						<form onSubmit={handleSubmit}>
						<TextField
							fullWidth
							label="Email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									disabled={isLoading}
									autoComplete="email"
							margin="normal"
							variant="outlined"
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
						variant="outlined"
					/>
						<Button
							type="submit"
							variant="contained"
							fullWidth
							disabled={isLoading || !email.trim() || !password.trim()}
							startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
							sx={[buttonStyles.gradientButton, spacing.mb2, { py: 1.5 }]}
						>
							{isLoading ? "Logging in..." : "Login"}
						</Button>
						<Box sx={{ my: 2 }}>
							<Divider sx={{ "&::before, &::after": { borderColor: "divider" } }}>
								<Typography variant="body2" color="text.secondary">ou</Typography>
							</Divider>
						</Box>
						<Button
							type="button"
							variant="outlined"
							fullWidth
							disabled={isLoading}
							onClick={() => (window.location.href = apiClient.getGoogleLoginUrl())}
							sx={[spacing.mb2, { py: 1.5, borderColor: "#4285f4", color: "#4285f4" }]}
							startIcon={
								<svg width="18" height="18" viewBox="0 0 18 18">
									<path fill="#4285f4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
									<path fill="#34a853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/>
									<path fill="#fbbc05" d="M4.5 10.52a4.8 4.8 0 010-3.08V5.38H1.83a8 8 0 000 7.12l2.67-1.98z"/>
									<path fill="#ea4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.38L4.5 7.36a4.77 4.77 0 014.48-3.18z"/>
								</svg>
							}
						>
							Continuer avec Google
						</Button>
						</form>
					{error && (
						<Alert severity="error" sx={spacing.mt2}>
							{error}
						</Alert>
					)}
					<Box textAlign="center" mt={2}>
						<Typography variant="body2" color="text.secondary">
							Don't have an account?{" "}
							<Link href="/register" style={{ color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>
								Register here
							</Link>
						</Typography>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
}

const LoginForm: React.FC<LoginFormProps> = (props) => {
	return (
		<Suspense
			fallback={
				<Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
					<CircularProgress />
				</Box>
			}
		>
			<LoginFormContent {...props} />
		</Suspense>
	);
};

export default LoginForm;
