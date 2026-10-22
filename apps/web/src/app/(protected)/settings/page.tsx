"use client";

import { useState } from "react";
import { Box, Stack, Container } from "@mui/material";
import { Input, Button, Muted, PageHeader, Panel, Text } from "@/components/ui";
import { useAuth } from "@/components/AuthContext";
import { layoutStyles, textFieldStyles } from "@/lib/styles";
import PasswordInput from "@/components/PasswordInput";
import { passwordRules } from "@/lib/passwordRules";

export default function SettingsPage() {
	const { user } = useAuth();
	const [email, setEmail] = useState(user?.email ?? "");
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
		console.warn("Sauvegarder email (non implémenté):", email);
	};

	const handleSavePassword = () => {
		// Logique non implémentée - seulement le design
		console.warn("Sauvegarder mot de passe (non implémenté)");
	};

	const isEmailChanged = email !== user?.email;
	const isPasswordValid = password && password.length >= 6 && password === confirmPassword;

	return (
		<Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
			<PageHeader title="Paramètres" finding="Les informations de connexion de ton compte." />

			<Stack spacing={4} data-motion="" sx={{ animation: "riseIn 420ms var(--ease-out) 60ms both" }}>
				<SettingsSection title="Email" description="L'adresse utilisée pour te connecter et récupérer ton compte.">
					<Input
						fullWidth
						label="Email"
						type="email"
						value={email}
						onChange={handleEmailChange}
						error={Boolean(emailError)}
						helperText={emailError}
						sx={textFieldStyles.standard}
					/>
					<Box sx={layoutStyles.flexEnd}>
						<Button onClick={handleSaveEmail} disabled={!isEmailChanged || Boolean(emailError) || !email}>
							Enregistrer
						</Button>
					</Box>
				</SettingsSection>

				<SettingsSection title="Mot de passe" description="Choisis un mot de passe que tu n'utilises nulle part ailleurs.">
					<PasswordInput
						label="Nouveau mot de passe"
						value={password}
						onChange={handlePasswordChange}
						error={Boolean(passwordError) && Boolean(password)}
						autoComplete="new-password"
						fullWidth
						validations={passwordRules}
					/>
					<PasswordInput
						label="Confirmer le mot de passe"
						value={confirmPassword}
						onChange={handleConfirmPasswordChange}
						error={Boolean(passwordError) && Boolean(confirmPassword)}
						autoComplete="new-password"
						fullWidth
					/>
					<Box sx={layoutStyles.flexEnd}>
						<Button onClick={handleSavePassword} disabled={!isPasswordValid}>
							Enregistrer
						</Button>
					</Box>
				</SettingsSection>
			</Stack>
		</Container>
	);
}

/** Une section de réglages : le libellé et son explication à gauche, les champs à droite. */
function SettingsSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
	return (
		<Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "240px 1fr" }, gap: { xs: 1.5, md: 4 } }}>
			<Box sx={{ pt: { md: 2.5 } }}>
				<Text sx={{ fontWeight: 600 }}>{title}</Text>
				<Muted sx={{ mt: 0.5 }}>{description}</Muted>
			</Box>
			<Panel sx={{ p: 3 }}>
				<Stack spacing={2.5}>{children}</Stack>
			</Panel>
		</Box>
	);
}
