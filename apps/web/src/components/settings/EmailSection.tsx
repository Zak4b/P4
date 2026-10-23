"use client";

import { useState } from "react";
import { Alert, Box } from "@mui/material";
import { Input, Button } from "@/components/ui";
import { layoutStyles, textFieldStyles } from "@/lib/styles";
import { emailField } from "@p4/schemas/auth";
import { useUpdateEmailMutation } from "@/lib/api/user/useUserMutation";
import SettingsSection from "./SettingsSection";
import ConfirmPasswordDialog from "./ConfirmPasswordDialog";
import { isWrongPasswordError, WRONG_PASSWORD_MESSAGE } from "./confirmPasswordError";

export default function EmailSection({ currentEmail }: { currentEmail: string }) {
	const [email, setEmail] = useState(currentEmail);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const updateEmail = useUpdateEmailMutation();

	const validation = emailField.safeParse(email.trim());
	const isChanged = validation.success ? validation.data !== currentEmail : email.trim() !== currentEmail;
	const validationError = isChanged && !validation.success ? validation.error.issues[0]?.message : undefined;
	const isWrongPassword = isWrongPasswordError(updateEmail.error);

	const openConfirm = () => {
		updateEmail.reset();
		setIsConfirmOpen(true);
	};

	const handleConfirm = (currentPassword: string) => {
		if (!validation.success) {
			return;
		}
		updateEmail.mutate(
			{ email: validation.data, currentPassword },
			{
				onSuccess: () => setIsConfirmOpen(false),
				// Mot de passe incorrect : la modale reste ouverte ; sinon l'erreur s'affiche dans la section
				onError: (error) => setIsConfirmOpen(isWrongPasswordError(error)),
			},
		);
	};

	return (
		<SettingsSection title="Email" description="L'adresse utilisée pour te connecter et récupérer ton compte.">
			<Input
				fullWidth
				label="Email"
				type="email"
				value={email}
				onChange={(e) => {
					setEmail(e.target.value);
					updateEmail.reset();
				}}
				error={Boolean(validationError)}
				helperText={validationError}
				autoComplete="email"
				sx={textFieldStyles.standard}
			/>
			{updateEmail.isError && !isWrongPassword && <Alert severity="error">{updateEmail.error.message}</Alert>}
			{updateEmail.isSuccess && <Alert severity="success">Email mis à jour.</Alert>}
			<Box sx={layoutStyles.flexEnd}>
				<Button onClick={openConfirm} disabled={!isChanged || !validation.success}>
					Enregistrer
				</Button>
			</Box>
			<ConfirmPasswordDialog
				open={isConfirmOpen}
				onClose={() => setIsConfirmOpen(false)}
				onConfirm={handleConfirm}
				isPending={updateEmail.isPending}
				error={isWrongPassword ? WRONG_PASSWORD_MESSAGE : undefined}
			/>
		</SettingsSection>
	);
}
