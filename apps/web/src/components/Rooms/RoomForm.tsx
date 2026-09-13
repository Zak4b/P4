"use client";

import React, { useState } from "react";
import { Stack, Alert, CircularProgress } from "@mui/material";
import { Input, Button } from "@/components/ui";
import { Add as AddIcon } from "@mui/icons-material";
import { useCreateRoomMutation } from "@/lib/api/room/useRoomMutation";
import { useRouter } from "next/navigation";

interface RoomFormProps {
	onSubmit: (roomId?: string) => void;
	onRoomCreated?: () => void;
}

const RoomForm: React.FC<RoomFormProps> = ({ onSubmit, onRoomCreated }) => {
	const [name, setName] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();
	const createRoomMutation = useCreateRoomMutation();
	const isLoading = createRoomMutation.isPending;

	const createRoom = async () => {
		if (!name.trim()) {
			setError("Le nom de la salle est requis");
			return;
		}

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

			const room = await createRoomMutation.mutateAsync({ name: roomId });

			setName("");
			// Naviguer vers la salle créée
			router.push(`/play/${room.id}`);
			// Recharger la liste des salles
			onRoomCreated?.();
			// Fermer le drawer
			onSubmit(room.id);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erreur lors de la création de la salle");
		}
	};

	const handleCreateRoom = (e: React.FormEvent) => {
		e.preventDefault();
		createRoom().catch((err: unknown) => console.error(err));
	};

	return (
		<form onSubmit={handleCreateRoom}>
			<Stack spacing={1}>
				<Stack direction="row" spacing={1}>
					<Input
						fullWidth
						placeholder="Nom de la nouvelle salle"
						value={name}
						onChange={(e) => {
							setName(e.target.value);
							setError("");
						}}
						size="small"
						disabled={isLoading}
						required
					/>
					<Button
						type="submit"
						startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
						disabled={isLoading || !name.trim()}
						sx={{
							backgroundColor: "primary.main",
							"&:hover": {
								backgroundColor: "primary.dark",
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
