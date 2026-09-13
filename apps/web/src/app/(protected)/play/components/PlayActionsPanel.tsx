"use client";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { EmojiEvents, PlayArrow } from "@mui/icons-material";
import JoinRoomForm from "./JoinRoomForm";

interface PlayActionsPanelProps {
	onQuickMatch: () => void;
}

export default function PlayActionsPanel({ onQuickMatch }: PlayActionsPanelProps) {
	return (
		<Stack spacing={4}>
			<Box>
				<Typography
					variant="overline"
					color="primary"
					sx={{
						fontWeight: "bold",
						letterSpacing: 1.5,
					}}
				>
					GAME CENTER
				</Typography>
				<Typography
					variant="h2"
					gutterBottom
					sx={{
						fontWeight: "800",
					}}
				>
					Ready to play?
				</Typography>
			</Box>

			<Stack spacing={2}>
				<Button
					onClick={onQuickMatch}
					variant="contained"
					size="large"
					startIcon={<PlayArrow />}
					sx={{
						py: 2,
						fontSize: "1.1rem",
						borderRadius: 3,
						textTransform: "none",
						fontWeight: "bold",
						backgroundColor: "primary.main",
						boxShadow: "0 8px 16px -4px rgba(99, 102, 241, 0.4)",
					}}
				>
					Quick Match
				</Button>
				<JoinRoomForm />
			</Stack>

			<Paper elevation={0} sx={{ p: 3, bgcolor: "primary.50", borderRadius: 4 }}>
				<Stack
					direction="row"
					spacing={2}
					sx={{
						alignItems: "flex-start",
					}}
				>
					<EmojiEvents color="gold" fontSize="large" />
					<Box>
						<Typography
							variant="h6"
							gutterBottom
							sx={{
								fontWeight: "bold",
							}}
						>
							Daily Challenge
						</Typography>
						<Typography
							variant="body2"
							sx={{
								color: "text.secondary",
							}}
						>
							Win 3 games in a row to unlock the &quot;Strategist&quot; badge and earn double points today!
						</Typography>
					</Box>
				</Stack>
			</Paper>
		</Stack>
	);
}
