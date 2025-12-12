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
import Podium from "./components/Podium";
import LeaderboardEntry, { LeaderboardPlayer } from "./components/LeaderboardEntry";

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

			<Podium topThree={topThree} />
			{rest.length > 0 && (
				<Paper
					elevation={3}
					sx={[paperStyles.gradientPaper, { p: 3 }]}
				>
					<Stack spacing={2}>
						{rest.map((player, index) => (
							<LeaderboardEntry
								key={player.id}
								player={player}
								rank={index + 4}
							/>
						))}
					</Stack>
				</Paper>
			)}
		</Box>
	);
}

