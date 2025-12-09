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
		<Box>
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
				<TableContainer component={Paper} elevation={3}>
					<Table>
						<TableHead>
							<TableRow sx={{ background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)" }}>
								<TableCell sx={{ color: "white", fontWeight: 600 }}>Players</TableCell>
								<TableCell sx={{ color: "white", fontWeight: 600 }}>Date</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{history.map((game) => {
								const player1Won = game.winner === "PLAYER1";
								const player2Won = game.winner === "PLAYER2";
								return (
								<TableRow
									key={game.id}
									sx={{
										"&:nth-of-type(odd)": {
											backgroundColor: "#f8fafc",
										},
										"&:hover": {
											backgroundColor: "#f1f5f9",
										},
									}}
								>
									<TableCell>
										<Stack direction="row" spacing={1}>
											<Chip
												label={game.player1.login}
												color={player1Won ? "success" : player2Won ? "error" : "default"}
												size="small"
												sx={{ fontWeight: 600 }}
											/>
											<Chip
												label={game.player2.login}
												color={player2Won ? "success" : player1Won ? "error" : "default"}
												size="small"
												sx={{ fontWeight: 600 }}
											/>
										</Stack>
									</TableCell>
									<TableCell>
										<Typography variant="body2" color="text.secondary">
											{formatDate(game.time)}
										</Typography>
									</TableCell>
								</TableRow>
							)})}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</Box>
	);
}

