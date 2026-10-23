"use client";

import { useState } from "react";
import { Alert, Box } from "@mui/material";
import { Input, Button } from "@/components/ui";
import { layoutStyles, textFieldStyles } from "@/lib/styles";
import { usernameField } from "@p4/schemas/auth";
import { useUpdateUsernameMutation } from "@/lib/api/user/useUserMutation";
import SettingsSection from "./SettingsSection";

export default function UsernameSection({ currentUsername }: { currentUsername: string }) {
	const [username, setUsername] = useState(currentUsername);
	const updateUsername = useUpdateUsernameMutation();

	const trimmed = username.trim();
	const isChanged = trimmed !== currentUsername;
	const validation = usernameField.safeParse(username);
	const validationError = isChanged && !validation.success ? validation.error.issues[0]?.message : undefined;

	const handleSave = () => {
		if (!validation.success) {
			return;
		}
		updateUsername.mutate(validation.data);
	};

	return (
		<SettingsSection title="Pseudo" description="Le nom affiché aux autres joueurs.">
			<Input
				fullWidth
				label="Pseudo"
				value={username}
				onChange={(e) => {
					setUsername(e.target.value);
					updateUsername.reset();
				}}
				disabled={updateUsername.isPending}
				error={Boolean(validationError)}
				helperText={validationError}
				autoComplete="username"
				sx={textFieldStyles.standard}
			/>
			{updateUsername.isError && <Alert severity="error">{updateUsername.error.message}</Alert>}
			{updateUsername.isSuccess && <Alert severity="success">Pseudo mis à jour.</Alert>}
			<Box sx={layoutStyles.flexEnd}>
				<Button onClick={handleSave} disabled={!isChanged || !validation.success || updateUsername.isPending}>
					Enregistrer
				</Button>
			</Box>
		</SettingsSection>
	);
}
