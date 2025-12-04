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
	Link,
	CircularProgress,
	FormHelperText,
} from "@mui/material";
import { PersonAdd as PersonAddIcon } from "@mui/icons-material";
import { useAuth } from "./AuthContext";
import { Link as RouterLink } from "react-router-dom";

interface RegisterFormProps {
	onRegister?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister }) => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { register } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!name.trim() || !email.trim() || !password.trim()) {
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
			await register(name, email, password);
			onRegister?.();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Registration failed");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
			<Card sx={{ maxWidth: 500, width: "100%", background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)" }}>
				<CardHeader
					title={
						<Typography variant="h5" fontWeight={700} sx={{ background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
							Register to P4 Game
						</Typography>
					}
					sx={{ pb: 1 }}
				/>
				<CardContent>
						<form onSubmit={handleSubmit}>
						<TextField
							fullWidth
							label="Name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							disabled={isLoading}
							autoComplete="name"
							margin="normal"
							variant="outlined"
							sx={{ mb: 2 }}
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
									autoComplete="new-password"
							inputProps={{ minLength: 8 }}
							margin="normal"
							variant="outlined"
							sx={{ mb: 1 }}
							helperText="Minimum 8 characters"
						/>
						<TextField
							fullWidth
							label="Confirm Password"
									type="password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									required
									disabled={isLoading}
									autoComplete="new-password"
							inputProps={{ minLength: 8 }}
							margin="normal"
							variant="outlined"
							sx={{ mb: 3 }}
								/>
						<Button
							type="submit"
							variant="contained"
							fullWidth
							disabled={isLoading || !name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()}
							startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
							sx={{
								mb: 2,
								py: 1.5,
								background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
								"&:hover": {
									background: "linear-gradient(135deg, #4f46e5 0%, #db2777 100%)",
								},
							}}
						>
							{isLoading ? "Registering..." : "Register"}
							</Button>
						</form>
					{error && (
						<Alert severity="error" sx={{ mt: 2 }}>
							{error}
						</Alert>
					)}
					<Box textAlign="center" mt={2}>
						<Typography variant="body2" color="text.secondary">
							Already have an account?{" "}
							<Link component={RouterLink} to="/login" sx={{ color: "#6366f1", fontWeight: 600 }}>
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
