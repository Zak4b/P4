"use client";

import React, { useState } from "react";
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
} from "@mui/material";
import { Login as LoginIcon } from "@mui/icons-material";
import { useAuth } from "./AuthContext";
import Link from "next/link";
import {
	cardStyles,
	typographyStyles,
	buttonStyles,
	spacing,
} from "@/lib/styles";

interface LoginFormProps {
	onLogin?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useAuth();

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
		} finally {
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
						<TextField
							fullWidth
							label="Password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									disabled={isLoading}
									autoComplete="current-password"
							inputProps={{ minLength: 8 }}
							margin="normal"
							variant="outlined"
							sx={spacing.mb3}
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
};

export default LoginForm;
