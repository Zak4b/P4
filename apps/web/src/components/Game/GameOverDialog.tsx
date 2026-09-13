"use client";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

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
				<Typography
					sx={{
						textAlign: "center",
						color: "text.secondary",
					}}
				>
					{isDraw ? "Le plateau est plein !" : "La partie est terminée."}
				</Typography>
			</DialogContent>
			<DialogActions sx={{ justifyContent: "center", pb: 2 }}>
				<Button
					variant="contained"
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
