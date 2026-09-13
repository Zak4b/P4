"use client";

import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Button, Muted } from "@/components/ui";

interface GameOverDialogProps {
	open: boolean;
	message: string;
	isDraw: boolean;
	onClose: () => void;
	onRestart: () => void;
}

export default function GameOverDialog({ open, message, isDraw, onClose, onRestart }: GameOverDialogProps) {
	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle sx={{ textAlign: "center", fontSize: "1.5rem" }}>{message}</DialogTitle>
			<DialogContent>
				<Muted variant="body1" sx={{ textAlign: "center" }}>
					{isDraw ? "Le plateau est plein !" : "La partie est terminée."}
				</Muted>
			</DialogContent>
			<DialogActions sx={{ justifyContent: "center", pb: 2 }}>
				<Button
					onClick={onRestart}
					sx={{
						backgroundColor: "primary.main",
						"&:hover": {
							backgroundColor: "primary.dark",
						},
					}}
				>
					Rejouer
				</Button>
			</DialogActions>
		</Dialog>
	);
}
