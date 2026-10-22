"use client";

import { Box, Stack, Typography } from "@mui/material";
import { Button, Muted, Panel, PanelHeader } from "@/components/ui";
import { EmojiEvents, PlayArrow } from "@mui/icons-material";
import JoinRoomForm from "./JoinRoomForm";

interface PlayActionsPanelProps {
	onQuickMatch: () => void;
}

/** Les deux façons d'entrer en partie, et le défi du jour. */
export default function PlayActionsPanel({ onQuickMatch }: PlayActionsPanelProps) {
	return (
		<Stack spacing={3}>
			{/* L'action principale, sur le bleu du plateau, avec un jeton jaune rogné dans le coin. */}
			<Box
				sx={{
					position: "relative",
					overflow: "hidden",
					borderRadius: "16px",
					bgcolor: "board.frame",
					color: "common.white",
					p: { xs: 3, sm: 4 },
				}}
			>
				<Box
					aria-hidden
					sx={{
						position: "absolute",
						width: 160,
						height: 160,
						borderRadius: "50%",
						bgcolor: "board.player2",
						right: -60,
						top: -80,
					}}
				/>
				<Box
					aria-hidden
					sx={{
						position: "absolute",
						width: 64,
						height: 64,
						borderRadius: "50%",
						bgcolor: "board.player1",
						right: 70,
						top: -36,
					}}
				/>
				<Box sx={{ position: "relative" }}>
					<Typography
						component="h2"
						sx={{ mb: 3, fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1 }}
					>
						Partie rapide
					</Typography>
					<Button
						onClick={onQuickMatch}
						size="lg"
						variant="secondary"
						startIcon={<PlayArrow />}
						fullWidth
						sx={{ py: 1.75, fontSize: "1.125rem" }}
					>
						Trouver un adversaire
					</Button>
				</Box>
			</Box>

			<Panel>
				<PanelHeader title="Rejoindre une partie" />
				<Box sx={{ px: { xs: 2, sm: 3 }, pb: 3 }}>
					<Muted sx={{ mb: 2 }}>Un ami t’a envoyé l’identifiant d’une partie ? Colle-le ici.</Muted>
					<JoinRoomForm />
				</Box>
			</Panel>

			{/* Le défi du jour, sur le jaune du jeton, avec son trophée. */}
			<Box
				sx={{
					display: "flex",
					gap: 2.5,
					alignItems: "center",
					borderRadius: "16px",
					bgcolor: "board.player2",
					color: "board.player2Contrast",
					p: { xs: 2.5, sm: 3 },
				}}
			>
				<Box
					sx={{
						flex: "none",
						width: 64,
						height: 64,
						borderRadius: "50%",
						bgcolor: "board.player2Contrast",
						color: "board.player2",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<EmojiEvents sx={{ fontSize: 36 }} />
				</Box>
				<Box>
					<Typography sx={{ fontWeight: 700, fontSize: "1.125rem" }}>Défi du jour</Typography>
					<Typography sx={{ mt: 0.25, opacity: 0.85 }}>
						Gagne 3 parties d’affilée pour débloquer le badge « Stratège » et doubler tes points aujourd’hui.
					</Typography>
				</Box>
			</Box>
		</Stack>
	);
}
