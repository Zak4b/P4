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
		<Container maxWidth="lg" sx={{ py: 6 }}>
			<Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
				<Typography
					variant="h4"
					fontWeight={700}
					sx={{
						background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
						display: "flex",
						alignItems: "center",
						gap: 1,
					}}
				>
					<HistoryIcon />
					Game History
				</Typography>
				<Button
					variant="outlined"
					startIcon={<RefreshIcon />}
					onClick={loadHistory}
					disabled={isLoading}
					sx={{
						borderColor: "#6366f1",
						color: "#6366f1",
						"&:hover": {
							borderColor: "#4f46e5",
							background: "rgba(99, 102, 241, 0.1)",
						},
					}}
				>
					Refresh
				</Button>
			</Stack>

			{history.length === 0 ? (
				<Paper
					elevation={3}
					sx={{
						p: 6,
						textAlign: "center",
						background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
					}}
				>
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
							<TableRow sx={{ background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)" }}>
								<TableCell sx={{ color: "white", fontWeight: 700, fontSize: "0.95rem", py: 2 }}>
									Joueurs
								</TableCell>
								<TableCell sx={{ color: "white", fontWeight: 700, fontSize: "0.95rem", py: 2 }}>
									Résultat
								</TableCell>
								<TableCell sx={{ color: "white", fontWeight: 700, fontSize: "0.95rem", py: 2 }}>
									Durée
								</TableCell>
								<TableCell sx={{ color: "white", fontWeight: 700, fontSize: "0.95rem", py: 2 }}>
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
									sx={{
										"&:nth-of-type(odd)": {
											backgroundColor: "#f8fafc",
										},
										"&:hover": {
											backgroundColor: "#e2e8f0",
											transition: "background-color 0.2s ease-in-out",
										},
										transition: "background-color 0.2s ease-in-out",
									}}
								>
									<TableCell sx={{ py: 2 }}>
										<Stack direction="row" spacing={1.5} alignItems="center">
											<Chip
												label={game.player1.login}
												color={player1Won ? "success" : player2Won ? "error" : "default"}
												size="medium"
												sx={{ 
													fontWeight: 600,
													fontSize: "0.875rem",
													height: 32,
												}}
											/>
											<Typography variant="body2" color="text.secondary" sx={{ mx: 0.5 }}>
												vs
											</Typography>
											<Chip
												label={game.player2.login}
												color={player2Won ? "success" : player1Won ? "error" : "default"}
												size="medium"
												sx={{ 
													fontWeight: 600,
													fontSize: "0.875rem",
													height: 32,
												}}
											/>
										</Stack>
									</TableCell>
									<TableCell sx={{ py: 2 }}>
										{isDraw ? (
											<Chip
												label="Match nul"
												color="default"
												size="small"
												sx={{ fontWeight: 600 }}
											/>
										) : (
											<Chip
												label={player1Won ? game.player1.login : game.player2.login}
												color="success"
												size="small"
												sx={{ fontWeight: 600 }}
											/>
										)}
									</TableCell>
									<TableCell sx={{ py: 2 }}>
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
									<TableCell sx={{ py: 2 }}>
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

