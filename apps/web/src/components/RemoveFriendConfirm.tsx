"use client";

import { Button, Stack, Typography } from "@mui/material";
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
			<Typography
				sx={{
					color: "text.secondary",
				}}
			>
				Voulez-vous retirer {targetLogin} de votre liste d&apos;amis ?
			</Typography>
			<Stack
				direction="row"
				spacing={2}
				sx={{
					justifyContent: "flex-end",
				}}
			>
				<Button variant="outlined" onClick={onCancel} disabled={isRemoving}>
					Annuler
				</Button>
				<Button
					variant="contained"
					color="error"
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
