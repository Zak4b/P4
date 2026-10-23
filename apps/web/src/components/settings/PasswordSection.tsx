"use client";

import { useState } from "react";
import { Alert, Box } from "@mui/material";
import { Button } from "@/components/ui";
import PasswordInput from "@/components/PasswordInput";
import { layoutStyles } from "@/lib/styles";
import { passwordRules } from "@/lib/passwordRules";
import { passwordField } from "@p4/schemas/auth";
import { useUpdatePasswordMutation } from "@/lib/api/user/useUserMutation";
import SettingsSection from "./SettingsSection";
import ConfirmPasswordDialog from "./ConfirmPasswordDialog";
import { isWrongPasswordError, WRONG_PASSWORD_MESSAGE } from "./confirmPasswordError";

export default function PasswordSection() {
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const updatePassword = useUpdatePasswordMutation();

	const isNewPasswordValid =
		passwordField.safeParse(newPassword).success && passwordRules.every(([isValid]) => isValid(newPassword));
	const isMismatch = confirmPassword.length > 0 && confirmPassword !== newPassword;
	const canSave = isNewPasswordValid && confirmPassword === newPassword;
	const isWrongPassword = isWrongPasswordError(updatePassword.error);

	const openConfirm = () => {
		updatePassword.reset();
		setIsConfirmOpen(true);
	};

	const handleConfirm = (currentPassword: string) => {
		updatePassword.mutate(
			{ currentPassword, newPassword },
			{
				onSuccess: () => {
					setIsConfirmOpen(false);
					setNewPassword("");
					setConfirmPassword("");
				},
				// Mot de passe incorrect : la modale reste ouverte ; sinon l'erreur s'affiche dans la section
				onError: (error) => setIsConfirmOpen(isWrongPasswordError(error)),
			},
		);
	};

	return (
		<SettingsSection title="Mot de passe" description="Choisis un mot de passe que tu n'utilises nulle part ailleurs.">
			<PasswordInput
				label="Nouveau mot de passe"
				value={newPassword}
				onChange={(e) => {
					setNewPassword(e.target.value);
					updatePassword.reset();
				}}
				autoComplete="new-password"
				fullWidth
				validations={passwordRules}
			/>
			<PasswordInput
				label="Confirmer le mot de passe"
				value={confirmPassword}
				onChange={(e) => {
					setConfirmPassword(e.target.value);
					updatePassword.reset();
				}}
				error={isMismatch}
				autoComplete="new-password"
				fullWidth
			/>
			{isMismatch && <Alert severity="warning">Les mots de passe ne correspondent pas.</Alert>}
			{updatePassword.isError && !isWrongPassword && <Alert severity="error">{updatePassword.error.message}</Alert>}
			{updatePassword.isSuccess && <Alert severity="success">Mot de passe mis à jour.</Alert>}
			<Box sx={layoutStyles.flexEnd}>
				<Button onClick={openConfirm} disabled={!canSave}>
					Enregistrer
				</Button>
			</Box>
			<ConfirmPasswordDialog
				open={isConfirmOpen}
				onClose={() => setIsConfirmOpen(false)}
				onConfirm={handleConfirm}
				isPending={updatePassword.isPending}
				error={isWrongPassword ? WRONG_PASSWORD_MESSAGE : undefined}
			/>
		</SettingsSection>
	);
}
