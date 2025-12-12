"use client";

import { useEffect, useState } from "react";
import {
	Box,
	Typography,
	Paper,
	CircularProgress,
	Alert,
	Stack,
} from "@mui/material";
import {
	EmojiEvents as TrophyIcon,
} from "@mui/icons-material";
import { apiClient } from "@/lib/api";
import {
	typographyStyles,
	paperStyles,
} from "@/lib/styles";
import UserAvatar from "@/components/UserAvatar";
import Podium from "./components/Podium";

interface LeaderboardPlayer {
	id: string;
	login: string;
	eloRating: number;
}

export default function LeaderboardPage() {
	const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const loadLeaderboard = async () => {
			setIsLoading(true);
			setError("");
			try {
				const leaderboard = await apiClient.getLeaderboard();
				setPlayers(leaderboard);
			} catch (err) {
				setError("Erreur lors du chargement du classement: " + err);
			} finally {
				setIsLoading(false);
			}
		};

		loadLeaderboard();
	}, []);

	if (isLoading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Alert severity="error">
				{error}
			</Alert>
		);
	}

	const topThree = players.slice(0, 3);
	const rest = players.slice(3);

	return (
		<Box>
			<Typography variant="h4" fontWeight={700} sx={typographyStyles.gradientTitle}>
				<TrophyIcon />
				Classement
			</Typography>

			{/* Podium */}
			<Box sx={{ mb: 6 }}>
				<Podium topThree={topThree} />
			</Box>
			{rest.length > 0 && (
				<Paper
					elevation={3}
					sx={[paperStyles.gradientPaper, { p: 3 }]}
				>
					<Stack spacing={2}>
						{rest.map((player, index) => (
							<Paper
								key={player.id}
								elevation={1}
								sx={{
									p: 2,
									display: "flex",
									alignItems: "center",
									gap: 2,
									background: "rgba(255, 255, 255, 0.7)",
									"&:hover": {
										background: "rgba(255, 255, 255, 0.9)",
										transition: "background-color 0.2s ease-in-out",
									},
								}}
							>
								<Box sx={{ minWidth: 40, textAlign: "center" }}>
									<Typography variant="h6" fontWeight={700} color="text.secondary">
										#{index + 4}
									</Typography>
								</Box>
								<UserAvatar
									login={player.login}
									sx={{ width: 50, height: 50 }}
								/>
								<Box sx={{ flexGrow: 1 }}>
									<Typography variant="body1" fontWeight={600}>
										{player.login}
									</Typography>
								</Box>
								<Box sx={{ textAlign: "right" }}>
									<Typography variant="h6" fontWeight={700} color="primary">
										{player.eloRating}
									</Typography>
									<Typography variant="caption" color="text.secondary">
										ELO
									</Typography>
								</Box>
							</Paper>
						))}
					</Stack>
				</Paper>
			)}

			{players.length === 0 && (
				<Alert severity="info">
					Aucun joueur dans le classement pour le moment.
				</Alert>
			)}
		</Box>
	);
}

