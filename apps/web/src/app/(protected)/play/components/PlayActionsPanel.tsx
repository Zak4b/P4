"use client";

import { Box, Paper, Stack } from "@mui/material";
import { Button, Heading, Text, Muted } from "@/components/ui";
import { EmojiEvents, PlayArrow } from "@mui/icons-material";
import JoinRoomForm from "./JoinRoomForm";

interface PlayActionsPanelProps {
	onQuickMatch: () => void;
}

export default function PlayActionsPanel({ onQuickMatch }: PlayActionsPanelProps) {
	return (
		<Stack spacing={4}>
			<Box>
				<Text
					variant="overline"
					color="primary"
					sx={{
						fontWeight: "bold",
						letterSpacing: 1.5,
					}}
				>
					GAME CENTER
				</Text>
				<Heading
					level={2}
					gutterBottom
					sx={{
						fontWeight: "800",
					}}
				>
					Ready to play?
				</Heading>
			</Box>

			<Stack spacing={2}>
				<Button
					onClick={onQuickMatch}
					size="lg"
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
						<Heading
							level={6}
							gutterBottom
							sx={{
								fontWeight: "bold",
							}}
						>
							Daily Challenge
						</Heading>
						<Muted>
							Win 3 games in a row to unlock the &quot;Strategist&quot; badge and earn double points today!
						</Muted>
					</Box>
				</Stack>
			</Paper>
		</Stack>
	);
}
