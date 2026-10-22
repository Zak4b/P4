"use client";

import { Box, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Button, Muted } from "@/components/ui";

interface GameOverDialogProps {
	open: boolean;
	message: string;
	isDraw: boolean;
	/** Numéro du joueur gagnant (1 ou 2), `null` en cas de nul. */
	winner: number | null;
	onClose: () => void;
	onRestart: () => void;
}

const DISC_SIZE = 88;

function Disc({ color, delay = 0, offset = 0 }: { color: string; delay?: number; offset?: number }) {
	return (
		<Box
			data-motion=""
			sx={{
				width: DISC_SIZE,
				height: DISC_SIZE,
				borderRadius: "50%",
				bgcolor: color,
				boxShadow: "inset 0 -6px 0 rgba(0,0,0,0.18)",
				ml: offset ? `${offset}px` : 0,
				"--drop": 3,
				animation: `tokenDrop 520ms ${delay}ms both`,
			}}
		/>
	);
}

/** Fin de partie : le jeton du gagnant tombe en place, les deux jetons pour un nul. */
export default function GameOverDialog({ open, message, isDraw, winner, onClose, onRestart }: GameOverDialogProps) {
	return (
		<Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
			<Box sx={{ display: "flex", justifyContent: "center", pt: 4 }}>
				{isDraw || winner === null ? (
					<>
						<Disc color="board.player1" />
						<Disc color="board.player2" delay={90} offset={-24} />
					</>
				) : (
					<Disc color={winner === 1 ? "board.player1" : "board.player2"} />
				)}
			</Box>
			<DialogTitle sx={{ textAlign: "center", fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em", pb: 0.5 }}>
				{message}
			</DialogTitle>
			<DialogContent>
				<Muted variant="body1" sx={{ textAlign: "center" }}>
					{isDraw ? "Le plateau est plein, personne ne passe." : "Quatre d'affilée. La partie est terminée."}
				</Muted>
			</DialogContent>
			<DialogActions sx={{ justifyContent: "center", pb: 4 }}>
				<Button size="lg" onClick={onRestart}>
					Rejouer
				</Button>
			</DialogActions>
		</Dialog>
	);
}
