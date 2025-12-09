"use client";

import { useEffect, useState } from "react";
import {
	Box,
	Typography,
	Button,
	CircularProgress,
	Alert,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Chip,
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
	tableStyles,
	chipStyles,
} from "@/lib/styles";

type Winner = "PLAYER1" | "PLAYER2" | "DRAW";
interface GameHistory {
	id: string;
	player1: { id: string; login: string };
	player2: { id: string; login: string };
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

	const formatDate = (dateStr: string | number) => {
		return new Date(dateStr).toLocaleString(undefined, {
			year: "numeric",
			month: "numeric",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const formatDuration = (seconds: number) => {
		if (seconds < 60) {
			return `${seconds}s`;
		}
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		if (remainingSeconds === 0) {
			return `${minutes}min`;
		}
		return `${minutes}min ${remainingSeconds}s`;
	};

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
				<TableContainer 
					component={Paper} 
					elevation={3}
					sx={{
						borderRadius: 2,
						overflow: "hidden",
					}}
				>
					<Table sx={{ minWidth: 650 }}>
						<TableHead>
							<TableRow sx={tableStyles.gradientHeader}>
								<TableCell sx={tableStyles.headerCell}>
									Joueurs
								</TableCell>
								<TableCell sx={tableStyles.headerCell}>
									Résultat
								</TableCell>
								<TableCell sx={tableStyles.headerCell}>
									Durée
								</TableCell>
								<TableCell sx={tableStyles.headerCell}>
									Date
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{history.map((game) => {
								const player1Won = game.winner === "PLAYER1";
								const player2Won = game.winner === "PLAYER2";
								const isDraw = game.winner === "DRAW";
								return (
								<TableRow
									key={game.id}
									sx={tableStyles.bodyRow}
								>
									<TableCell sx={tableStyles.bodyCell}>
										<Stack direction="row" spacing={1.5} alignItems="center">
											<Chip
												label={game.player1.login}
												color={player1Won ? "success" : player2Won ? "error" : "default"}
												size="medium"
												sx={chipStyles.standard}
											/>
											<Typography variant="body2" color="text.secondary" sx={{ mx: 0.5 }}>
												vs
											</Typography>
											<Chip
												label={game.player2.login}
												color={player2Won ? "success" : player1Won ? "error" : "default"}
												size="medium"
												sx={chipStyles.standard}
											/>
										</Stack>
									</TableCell>
									<TableCell sx={tableStyles.bodyCell}>
										{isDraw ? (
											<Chip
												label="Match nul"
												color="default"
												size="small"
												sx={chipStyles.small}
											/>
										) : (
											<Chip
												label={player1Won ? game.player1.login : game.player2.login}
												color="success"
												size="small"
												sx={chipStyles.small}
											/>
										)}
									</TableCell>
									<TableCell sx={tableStyles.bodyCell}>
										<Typography 
											variant="body2" 
											sx={{ 
												fontWeight: 600,
												color: "#6366f1",
												fontSize: "0.9rem",
											}}
										>
											{formatDuration(game.duration)}
										</Typography>
									</TableCell>
									<TableCell sx={tableStyles.bodyCell}>
										<Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
											{formatDate(game.time)}
										</Typography>
									</TableCell>
								</TableRow>
							)})}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</Container>
	);
}

