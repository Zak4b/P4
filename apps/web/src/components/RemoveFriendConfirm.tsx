"use client";

import { Stack } from "@mui/material";
import { Button, Muted } from "@/components/ui";
import { PersonRemove as PersonRemoveIcon } from "@mui/icons-material";

interface RemoveFriendConfirmProps {
	targetLogin: string;
	isRemoving: boolean;
	onCancel: () => void;
	onConfirm: () => void;
}

export default function RemoveFriendConfirm({
	targetLogin,
	isRemoving,
	onCancel,
	onConfirm,
}: RemoveFriendConfirmProps) {
	return (
		<Stack spacing={3}>
			<Muted variant="body1">Voulez-vous retirer {targetLogin} de votre liste d&apos;amis ?</Muted>
			<Stack
				direction="row"
				spacing={2}
				sx={{
					justifyContent: "flex-end",
				}}
			>
				<Button variant="outline" onClick={onCancel} disabled={isRemoving}>
					Annuler
				</Button>
				<Button
					variant="destructive"
					startIcon={<PersonRemoveIcon />}
					disabled={isRemoving}
					onClick={onConfirm}
				>
					{isRemoving ? "Suppression..." : "Retirer l'ami"}
				</Button>
			</Stack>
		</Stack>
	);
}
