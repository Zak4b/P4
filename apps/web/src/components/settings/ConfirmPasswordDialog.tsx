"use client";

import { useState } from "react";
import { Alert, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import { Button, Muted } from "@/components/ui";
import PasswordInput from "@/components/PasswordInput";

interface ConfirmPasswordDialogProps {
	open: boolean;
	onClose: () => void;
	onConfirm: (currentPassword: string) => void;
	isPending: boolean;
	/** Erreur liée au mot de passe : affichée dans la modale, qui reste ouverte pour réessayer */
	error?: string;
}

/** Demande le mot de passe actuel avant une modification sensible (email, mot de passe) */
export default function ConfirmPasswordDialog({ open, onClose, onConfirm, isPending, error }: ConfirmPasswordDialogProps) {
	const [password, setPassword] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (password && !isPending) {
			onConfirm(password);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={isPending ? undefined : onClose}
			maxWidth="xs"
			fullWidth
			slotProps={{ transition: { onExited: () => setPassword("") } }}
		>
			<form onSubmit={handleSubmit}>
				<DialogTitle>Confirme avec ton mot de passe</DialogTitle>
				<DialogContent>
					<Stack spacing={2.5} sx={{ pt: 0.5 }}>
						<Muted>Par sécurité, saisis ton mot de passe actuel pour valider cette modification.</Muted>
						<PasswordInput
							label="Mot de passe actuel"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={isPending}
							error={Boolean(error)}
							autoComplete="current-password"
							autoFocus
							fullWidth
						/>
						{error && <Alert severity="error">{error}</Alert>}
					</Stack>
				</DialogContent>
				<DialogActions sx={{ px: 3, pb: 2.5 }}>
					<Button variant="ghost" onClick={onClose} disabled={isPending}>
						Annuler
					</Button>
					<Button type="submit" disabled={!password || isPending}>
						{isPending ? "Validation…" : "Valider"}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}
