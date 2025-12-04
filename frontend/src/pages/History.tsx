import React, { useEffect, useState } from "react";
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
import { apiClient } from "../api";

interface GameHistory {
	id: string;
	name_1: string;
	name_2: string;
	player_1: number;
	player_2: number;
	result: number;
	time: number;
}

const HistoryPage: React.FC = () => {
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
		loadHistory();
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
							{history.map((game) => (
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
												label={game.name_1}
												color={game.result == 1 ? "success" : "error"}
												size="small"
												sx={{ fontWeight: 600 }}
											/>
											<Chip
												label={game.name_2}
												color={game.result == 2 ? "success" : "error"}
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
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</Box>
	);
};

export default HistoryPage;
