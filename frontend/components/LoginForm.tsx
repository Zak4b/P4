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
			<Card sx={{ maxWidth: 450, width: "100%", background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)" }}>
				<CardHeader
					title={
						<Typography variant="h5" fontWeight={700} sx={{ background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
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
							sx={{ mb: 2 }}
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
							sx={{ mb: 3 }}
								/>
						<Button
							type="submit"
							variant="contained"
							fullWidth
							disabled={isLoading || !email.trim() || !password.trim()}
							startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
							sx={{
								mb: 2,
								py: 1.5,
								background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
								"&:hover": {
									background: "linear-gradient(135deg, #4f46e5 0%, #db2777 100%)",
								},
							}}
						>
							{isLoading ? "Logging in..." : "Login"}
							</Button>
						</form>
					{error && (
						<Alert severity="error" sx={{ mt: 2 }}>
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
