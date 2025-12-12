"use client";

import React, { useState } from "react";
import { TextField, Button, Stack, Alert, CircularProgress } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { apiClient } from "@/lib/api";
import { useRouter } from "next/navigation";
import { colors } from "@/lib/styles";

interface RoomFormProps {
	onSubmit: (roomId?: string) => void;
	onRoomCreated?: () => void;
}

const RoomForm: React.FC<RoomFormProps> = ({ onSubmit, onRoomCreated }) => {
	const [name, setName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const handleCreateRoom = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) {
			setError("Le nom de la salle est requis");
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			// Formater le nom pour respecter le regex /^[\w0-9]+$/ (alphanumériques et underscores uniquement)
			const roomId =
				name
					.trim()
					.replace(/[^a-zA-Z0-9_]/g, "_")
					.replace(/_+/g, "_")
					.replace(/^_|_$/g, "") || `room_${Date.now()}`;

			if (!roomId) {
				setError("Le nom de la salle doit contenir au moins un caractère alphanumérique");
				return;
			}

			const response = await apiClient.newRoom(roomId);

			if (response.success) {
				setName("");
				// Naviguer vers la salle créée
				router.push(`/play/${response.roomId}`);
				// Recharger la liste des salles
				onRoomCreated?.();
				// Fermer le drawer
				onSubmit(response.roomId);
			} else {
				setError("Impossible de créer la salle");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erreur lors de la création de la salle");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleCreateRoom}>
			<Stack spacing={1}>
				<Stack direction="row" spacing={1}>
					<TextField
						fullWidth
						placeholder="Nom de la nouvelle salle"
						value={name}
						onChange={(e) => {
							setName(e.target.value);
							setError("");
						}}
						size="small"
						variant="outlined"
						disabled={isLoading}
						required
					/>
					<Button
						type="submit"
						variant="contained"
						startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
						disabled={isLoading || !name.trim()}
						sx={{
							backgroundColor: colors.primary,
							"&:hover": {
								backgroundColor: colors.primaryHover,
							},
						}}
					>
						Créer
					</Button>
				</Stack>
				{error && (
					<Alert severity="error" sx={{ mt: 1 }}>
						{error}
					</Alert>
				)}
			</Stack>
		</form>
	);
};

export default RoomForm;
