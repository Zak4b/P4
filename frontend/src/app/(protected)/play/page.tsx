"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Container,
	Box,
	Typography,
	Paper,
	Grid,
	Button,
	Stack,
	TextField,
	InputAdornment,
	CircularProgress,
	Dialog,
	DialogTitle,
	DialogContent,
} from "@mui/material";
import {
	PlayArrow,
	EmojiEvents,
	Search,
	SmartToy,
} from "@mui/icons-material";
import { colors } from "@/lib/styles";
import RuleList from "@/components/Game/Rules/RuleList";
import { useMatching } from "@/hooks/useMatching";
import { apiClient } from "@/lib/api";

type Difficulty = "easy" | "medium" | "hard" | "impossible" | "draw";

const DIFFICULTIES: { value: Difficulty; label: string; description: string; color: string }[] = [
	{ value: "easy",       label: "Facile",       description: "Joue approximativement, fait des erreurs",      color: "#4caf50" },
	{ value: "medium",     label: "Normal",        description: "Joue bien mais reste humainement battable",     color: "#ff9800" },
	{ value: "hard",       label: "Difficile",     description: "Joue très bien, rare de la battre",             color: "#f44336" },
	{ value: "impossible", label: "Impossible",    description: "Jeu optimal — aucune pitié",                    color: "#9c27b0" },
	{ value: "draw",       label: "Match nul",     description: "Cherche activement le match nul",               color: "#00bcd4" },
];

export default function PlayIndexPage() {
	const router = useRouter();
	const { modal, startMatchmaking, isConnected } = useMatching();
	const [joinRoomId, setJoinRoomId] = useState("");
	const [aiLoading, setAiLoading] = useState(false);
	const [difficultyOpen, setDifficultyOpen] = useState(false);

	const handlePlayVsAI = async (difficulty: Difficulty) => {
		setDifficultyOpen(false);
		setAiLoading(true);
		try {
			const { roomId } = await apiClient.newAIRoom(difficulty);
			if (roomId) router.push(`/play/${roomId}`);
		} catch {
			// ignore
		} finally {
			setAiLoading(false);
		}
	};

	const handleJoinSpecificRoom = (e: React.FormEvent) => {
		e.preventDefault();
		if (joinRoomId.trim()) {
			router.push(`/play/${joinRoomId.trim()}`);
		}
	};

	return (
		<Container maxWidth="lg" sx={{ py: 6 }}>
			<Grid container spacing={6}>
				{/* Left Column: Actions */}
				<Grid size={{ xs: 12, md: 5 }}>
					<Stack spacing={4}>
						<Box>
							<Typography
								variant="overline"
								fontWeight="bold"
								color="primary"
								sx={{ letterSpacing: 1.5 }}
							>
								GAME CENTER
							</Typography>
							<Typography variant="h2" fontWeight="800" gutterBottom>
								Ready to play?
							</Typography>
						</Box>

						<Stack spacing={2}>
							<Button
								onClick={startMatchmaking}
								variant="contained"
								size="large"
								startIcon={<PlayArrow />}
								sx={{
									py: 2,
									fontSize: "1.1rem",
									borderRadius: 3,
									textTransform: "none",
									fontWeight: "bold",
									backgroundColor: colors.primary,
									boxShadow: "0 8px 16px -4px rgba(99, 102, 241, 0.4)",
								}}
							>
								Quick Match
							</Button>

							<Button
								onClick={() => setDifficultyOpen(true)}
								disabled={aiLoading}
								variant="outlined"
								size="large"
								startIcon={aiLoading ? <CircularProgress size={18} color="inherit" /> : <SmartToy />}
								sx={{
									py: 2,
									fontSize: "1.1rem",
									borderRadius: 3,
									textTransform: "none",
									fontWeight: "bold",
									borderColor: colors.primary,
									color: colors.primary,
									"&:hover": {
										borderColor: colors.primaryHover,
										backgroundColor: "rgba(99, 102, 241, 0.06)",
									},
								}}
							>
								Play vs AI
							</Button>

							<Paper
								component="form"
								onSubmit={handleJoinSpecificRoom}
								elevation={0}
								sx={{
									p: 0.5,
									display: "flex",
									alignItems: "center",
									border: "1px solid",
									borderColor: "divider",
									borderRadius: 3,
								}}
							>
								<TextField
									placeholder="Enter Room ID..."
									variant="standard"
									fullWidth
									value={joinRoomId}
									onChange={(e) => setJoinRoomId(e.target.value)}
									InputProps={{
										disableUnderline: true,
										startAdornment: (
											<InputAdornment position="start" sx={{ pl: 2 }}>
												<Search color="action" />
											</InputAdornment>
										),
									}}
									sx={{ px: 1 }}
								/>
								<Button
									type="submit"
									disabled={!joinRoomId.trim()}
									variant="contained"
									color="secondary"
									sx={{
										borderRadius: 2.5,
										px: 3,
										textTransform: "none",
										fontWeight: "bold"
									}}
								>
									Join
								</Button>
							</Paper>
						</Stack>

						<Paper
							elevation={0}
							sx={{ p: 3, bgcolor: "primary.50", borderRadius: 4 }}
						>
							<Stack direction="row" spacing={2} alignItems="flex-start">
								<EmojiEvents color="gold" fontSize="large" />
								<Box>
									<Typography variant="h6" fontWeight="bold" gutterBottom>
										Daily Challenge
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Win 3 games in a row to unlock the "Strategist" badge and
										earn double points today!
									</Typography>
								</Box>
							</Stack>
						</Paper>
					</Stack>
				</Grid>

				{/* Right Column: Info & Rules */}
				<Grid size={{ xs: 12, md: 7 }}>
					<Stack spacing={4}>
						<Box>
							<Typography variant="h5" fontWeight="bold" gutterBottom>
								How to Play
							</Typography>
							<Paper variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden' }}>
								<RuleList />
							</Paper>
						</Box>
					</Stack>
				</Grid>
			</Grid>
			{modal}

			<Dialog open={difficultyOpen} onClose={() => setDifficultyOpen(false)} maxWidth="xs" fullWidth>
				<DialogTitle sx={{ fontWeight: "bold", pb: 1 }}>Choisir la difficulté</DialogTitle>
				<DialogContent>
					<Stack spacing={1.5} sx={{ pt: 1 }}>
						{DIFFICULTIES.map(({ value, label, description, color }) => (
							<Button
								key={value}
								onClick={() => handlePlayVsAI(value)}
								variant="outlined"
								fullWidth
								sx={{
									py: 1.5,
									borderRadius: 2,
									textTransform: "none",
									borderColor: color,
									color: color,
									justifyContent: "flex-start",
									gap: 2,
									"&:hover": { backgroundColor: `${color}12`, borderColor: color },
								}}
							>
								<Box sx={{ textAlign: "left" }}>
									<Typography fontWeight="bold" fontSize="1rem">{label}</Typography>
									<Typography variant="caption" color="text.secondary">{description}</Typography>
								</Box>
							</Button>
						))}
					</Stack>
				</DialogContent>
			</Dialog>
		</Container>
	);
}
