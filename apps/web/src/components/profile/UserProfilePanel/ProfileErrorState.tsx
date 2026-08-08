"use client";

import { Alert, Button, Paper } from "@mui/material";
import { paperStyles } from "@/lib/styles";

interface ProfileErrorStateProps {
	onRetry: () => void;
}

export function ProfileErrorState({ onRetry }: ProfileErrorStateProps) {
	return (
		<Paper elevation={3} sx={[paperStyles.gradientPaper, { p: 3, height: "100%" }]}>
			<Alert
				severity="error"
				action={
					<Button color="inherit" size="small" onClick={onRetry}>
						Réessayer
					</Button>
				}
			>
				Impossible de charger ce profil.
			</Alert>
		</Paper>
	);
}
