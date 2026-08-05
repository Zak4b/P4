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
import { PersonAdd as PersonAddIcon } from "@mui/icons-material";
import { useAuth } from "./AuthContext";
import Link from "next/link";
import {
	cardStyles,
	typographyStyles,
	buttonStyles,
	spacing,
} from "@/lib/styles";
import PasswordInput from "./PasswordInput";
import { passwordRules } from "@/lib/passwordRules";

interface RegisterFormProps {
	onRegister?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister }) => {
	const [login, setLogin] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { register } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!login.trim() || !email.trim() || !password.trim()) {
			setError("All fields are required");
			return;
		}

		if (password.length < 8) {
			setError("Password must be at least 8 characters long");
			return;
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			await register(login, email, password);
			onRegister?.();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Registration failed");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
			<Card sx={cardStyles.authCardLarge}>
				<CardHeader
					title={
						<Typography variant="h5" fontWeight={700} sx={typographyStyles.gradientHeading}>
							Register to P4 Game
						</Typography>
					}
					sx={{ pb: 1 }}
				/>
				<CardContent>
						<form onSubmit={handleSubmit}>
						<TextField
							fullWidth
							label="Login"
							type="text"
							value={login}
							onChange={(e) => setLogin(e.target.value)}
							required
							disabled={isLoading}
							autoComplete="username"
							margin="normal"
							variant="outlined"
							sx={spacing.mb2}
						/>
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
						autoComplete="new-password"
						fullWidth
						margin="normal"
						variant="outlined"
						validations={passwordRules}
					/>
					<PasswordInput
						label="Confirm Password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
						disabled={isLoading}
						autoComplete="new-password"
						fullWidth
						margin="normal"
						variant="outlined"
					/>
						<Button
							type="submit"
							variant="contained"
							fullWidth
							disabled={isLoading || !login.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()}
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
					<Box textAlign="center" mt={2}>
						<Typography variant="body2" color="text.secondary">
							Already have an account?{" "}
							<Link href="/login" style={{ color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>
								Login here
							</Link>
						</Typography>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
};

export default RegisterForm;
