"use client";

import { useState } from "react";
import { Box, Typography, Paper, TextField, Button, Stack, Divider, Container } from "@mui/material";
import {
	Settings as SettingsIcon,
	Email as EmailIcon,
	Lock as LockIcon,
	Save as SaveIcon,
} from "@mui/icons-material";
import { useAuth } from "@/components/AuthContext";
import {
	layoutStyles,
	typographyStyles,
	paperStyles,
	buttonStyles,
	textFieldStyles,
} from "@/lib/styles";
import PasswordInput from "@/components/PasswordInput";
import { passwordRules } from "@/lib/passwordRules";

export default function SettingsPage() {
	const { user } = useAuth();
	const [email, setEmail] = useState(user?.email || "");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setEmail(value);
		// Validation basique de l'email
		if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
			setEmailError("Format d'email invalide");
		} else {
			setEmailError("");
		}
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setPassword(value);
	};

	const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setConfirmPassword(value);
		if (value && password && value !== password) {
			setPasswordError("Les mots de passe ne correspondent pas");
		} else {
			setPasswordError("");
		}
	};

	const handleSaveEmail = () => {
		// Logique non implémentée - seulement le design
		console.log("Sauvegarder email:", email);
	};

	const handleSavePassword = () => {
		// Logique non implémentée - seulement le design
		console.log("Sauvegarder mot de passe");
	};

	const isEmailChanged = email !== user?.email;
	const isPasswordValid = password && password.length >= 6 && password === confirmPassword;

	return (
		<Container maxWidth="lg" sx={layoutStyles.container}>
			<Typography variant="h4" fontWeight={700} sx={typographyStyles.gradientTitle}>
				<SettingsIcon />
				Paramètres
			</Typography>

			<Stack spacing={4}>
				{/* Section Email */}
				<Paper elevation={3} sx={paperStyles.gradientPaper}>
					<Stack spacing={3}>
						<Box sx={layoutStyles.flexCenter}>
							<EmailIcon color="primary" />
							<Typography variant="h6" fontWeight={600}>
								Modifier l&apos;email
							</Typography>
						</Box>
						<Divider />
						<TextField
							fullWidth
							label="Email"
							type="email"
							value={email}
							onChange={handleEmailChange}
							error={!!emailError}
							helperText={emailError}
							variant="outlined"
							sx={textFieldStyles.standard}
						/>
						<Box sx={layoutStyles.flexEnd}>
							<Button
								variant="contained"
								startIcon={<SaveIcon />}
								onClick={handleSaveEmail}
								disabled={!isEmailChanged || !!emailError || !email}
								sx={[buttonStyles.gradientButtonDisabled, { px: 3 }]}
							>
								Sauvegarder
							</Button>
						</Box>
					</Stack>
				</Paper>

				{/* Section Mot de passe */}
				<Paper elevation={3} sx={paperStyles.gradientPaper}>
					<Stack spacing={3}>
						<Box sx={layoutStyles.flexCenter}>
							<LockIcon color="primary" />
							<Typography variant="h6" fontWeight={600}>
								Modifier le mot de passe
							</Typography>
						</Box>
						<Divider />
						<PasswordInput
							label="Nouveau mot de passe"
							value={password}
							onChange={handlePasswordChange}
							error={!!passwordError && !!password}
							autoComplete="new-password"
							fullWidth
							validations={passwordRules}
						/>
						<PasswordInput
							label="Confirmer le mot de passe"
							value={confirmPassword}
							onChange={handleConfirmPasswordChange}
							error={!!passwordError && !!confirmPassword}
							autoComplete="new-password"
							fullWidth
						/>
						<Box sx={layoutStyles.flexEnd}>
							<Button
								variant="contained"
								startIcon={<SaveIcon />}
								onClick={handleSavePassword}
								disabled={!isPasswordValid}
								sx={[buttonStyles.gradientButtonDisabled, { px: 3 }]}
							>
								Sauvegarder
							</Button>
						</Box>
					</Stack>
				</Paper>
			</Stack>
		</Container>
	);
}

