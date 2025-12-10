"use client";

import { useEffect, useState } from "react";
import {
	Box,
	Typography,
	Button,
	CircularProgress,
	Alert,
	Paper,
	Stack,
	Container,
} from "@mui/material";
import { Refresh as RefreshIcon, History as HistoryIcon } from "@mui/icons-material";
import { apiClient } from "@/lib/api";
import {
	layoutStyles,
	typographyStyles,
	paperStyles,
	buttonStyles,
} from "@/lib/styles";
import HistoryCard from "@/components/HistoryCard";

type Winner = "PLAYER1" | "PLAYER2" | "DRAW";
interface GameHistory {
	id: string;
	player1: { id: string; login: string; eloRating?: number };
	player2: { id: string; login: string; eloRating?: number };
	winner: Winner;
	board: number[][];
	time: number;
	duration: number;
}

export default function HistoryPage() {
	const [history, setHistory] = useState<GameHistory[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	const loadHistory = () => {
		setIsLoading(true);
		setError("");
		apiClient
			.getHistory()
			.then(setHistory)
			.catch(() => setError("Failed to load history"))
			.finally(() => setIsLoading(false));
	};

	useEffect(() => {
		const t = setTimeout(() => loadHistory(), 0);
		return () => clearTimeout(t);
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
			<Alert
				severity="error"
				action={
					<Button color="inherit" size="small" onClick={loadHistory}>
						Retry
					</Button>
				}
			>
				{error}
			</Alert>
		);
	}

	return (
		<Container maxWidth="lg" sx={layoutStyles.container}>
			<Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
				<Typography variant="h4" fontWeight={700} sx={typographyStyles.gradientTitle}>
					<HistoryIcon />
					Game History
				</Typography>
				<Button
					variant="outlined"
					startIcon={<RefreshIcon />}
					onClick={loadHistory}
					disabled={isLoading}
					sx={buttonStyles.primaryOutlined}
				>
					Refresh
				</Button>
			</Stack>

			{history.length === 0 ? (
				<Paper elevation={3} sx={paperStyles.gradientPaperLarge}>
					<Typography variant="h5" color="text.secondary" gutterBottom>
						No games played yet
					</Typography>
					<Typography variant="body1" color="text.secondary">
						Start a game to see your history here!
					</Typography>
				</Paper>
			) : (
				<Stack spacing={2}>
					{history.map((game) => (
						<HistoryCard
							key={game.id}
							id={game.id}
							player1={game.player1}
							player2={game.player2}
							winner={game.winner}
							time={game.time}
							duration={game.duration}
						/>
					))}
				</Stack>
			)}
		</Container>
	);
}
