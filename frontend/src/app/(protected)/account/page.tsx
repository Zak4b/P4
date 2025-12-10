"use client";

import { useEffect, useState } from "react";
import {
	Box,
	Typography,
	Paper,
	CircularProgress,
	Alert,
	Grid,
	Card,
	CardContent,
	Avatar,
	Stack,
	Chip,
	Divider,
} from "@mui/material";
import {
	Person as PersonIcon,
	Email as EmailIcon,
	Badge as BadgeIcon,
	EmojiEvents as TrophyIcon,
	SportsEsports as GameIcon,
	TrendingUp as WinIcon,
	TrendingDown as LossIcon,
	Remove as DrawIcon,
} from "@mui/icons-material";
import { useAuth } from "@/components/AuthContext";
import { apiClient, getAvatarUrl } from "@/lib/api";
import {
	typographyStyles,
	paperStyles,
	avatarStyles,
	layoutStyles,
	dividerStyles,
} from "@/lib/styles";

type Winner = "PLAYER1" | "PLAYER2" | "DRAW";
interface GameHistory {
	id: string;
	player1: { id: string; login: string };
	player2: { id: string; login: string };
	winner: Winner;
	board: any;
	time: number;
}

interface UserStats {
	totalGames: number;
	wins: number;
	losses: number;
	draws: number;
	winRate: number;
}

export default function AccountPage() {
	const { user } = useAuth();
	const [history, setHistory] = useState<GameHistory[]>([]);
	const [stats, setStats] = useState<UserStats | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!user) return;

		const loadData = async () => {
			setIsLoading(true);
			setError("");
			try {
				const gameHistory = await apiClient.getHistory();
				setHistory(gameHistory);

				// Calculer les statistiques
				const userStats = calculateStats(gameHistory, user.id);
				setStats(userStats);
			} catch (err) {
				setError("Failed to load account data");
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, [user]);

	const calculateStats = (games: GameHistory[], userId: string): UserStats => {
		let wins = 0;
		let losses = 0;
		let draws = 0;

		games.forEach((game) => {
			const isPlayer1 = game.player1.id === userId;
			const isPlayer2 = game.player2.id === userId;

			if (isPlayer1 || isPlayer2) {
				if (game.winner === "DRAW") {
					draws++;
				} else if ((isPlayer1 && game.winner === "PLAYER1") || (isPlayer2 && game.winner === "PLAYER2")) {
					wins++;
				} else {
					losses++;
				}
			}
		});

		const totalGames = wins + losses + draws;
		const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

		return {
			totalGames,
			wins,
			losses,
			draws,
			winRate,
		};
	};

	const getInitials = (login?: string | null) => {
		if (!login) return "";
		return login
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
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
			<Alert severity="error">
				{error}
			</Alert>
		);
	}

	if (!user) {
		return (
			<Alert severity="warning">
				User information not available
			</Alert>
		);
	}

	return (
		<Box>
			<Typography variant="h4" fontWeight={700} sx={typographyStyles.gradientTitle}>
				<PersonIcon />
				Mon compte
			</Typography>

			<Grid container spacing={3}>
				{/* Informations utilisateur */}
				<Grid size={{ xs: 12, md: 6 }}>
					<Paper
						elevation={3}
						sx={[paperStyles.gradientPaper, { p: 3, height: "100%" }]}
					>
						<Stack spacing={3} alignItems="center">
							<Avatar
								src={getAvatarUrl(user.login)}
								sx={{ ...(avatarStyles.large as any), ...(avatarStyles.gradientAvatar as any), bgcolor: "primary.main" }}
							>
								{getInitials(user.login)}
							</Avatar>
							<Box sx={{ width: "100%" }}>
								<Stack spacing={2}>
									<Box sx={layoutStyles.flexCenter}>
										<PersonIcon color="primary" />
										<Typography variant="h6" fontWeight={600}>
											{user.login}
										</Typography>
									</Box>
									<Divider />
									<Box sx={layoutStyles.flexCenter}>
										<EmailIcon color="primary" />
										<Typography variant="body1" color="text.secondary">
											{user.email}
										</Typography>
									</Box>
									<Box sx={layoutStyles.flexCenter}>
										<BadgeIcon color="primary" />
										<Typography variant="body2" color="text.secondary">
											ID: {user.id}
										</Typography>
									</Box>
								</Stack>
							</Box>
						</Stack>
					</Paper>
				</Grid>

				{/* Statistiques */}
				<Grid size={{ xs: 12, md: 6 }}>
					<Card
						elevation={3}
						sx={[
							paperStyles.gradientCard,
							{ height: "100%" },
						]}
					>
						<CardContent>
							<Typography variant="h6" fontWeight={600} gutterBottom sx={layoutStyles.flexCenter}>
								<TrophyIcon color="primary" />
								Statistiques de jeu
							</Typography>
							<Divider sx={dividerStyles.standard} />
							{stats ? (
								<Grid container spacing={3}>
									<Grid size={{xs: 6, sm: 3}}>
										<Box textAlign="center">
											<Typography variant="h4" fontWeight={700} color="primary">
												{stats.totalGames}
											</Typography>
											<Typography variant="body2" color="text.secondary" sx={[layoutStyles.flexCenterJustifyCenter, { mt: 0.5 }]}>
												<GameIcon fontSize="small" />
												Parties
											</Typography>
										</Box>
									</Grid>
									<Grid size={{xs: 6, sm: 3}}>
										<Box textAlign="center">
											<Typography variant="h4" fontWeight={700} color="success.main">
												{stats.wins}
											</Typography>
											<Typography variant="body2" color="text.secondary" sx={[layoutStyles.flexCenterJustifyCenter, { mt: 0.5 }]}>
												<WinIcon fontSize="small" />
												Victoires
											</Typography>
										</Box>
									</Grid>
									<Grid size={{xs: 6, sm: 3}}>
										<Box textAlign="center">
											<Typography variant="h4" fontWeight={700} color="error.main">
												{stats.losses}
											</Typography>
											<Typography variant="body2" color="text.secondary" sx={[layoutStyles.flexCenterJustifyCenter, { mt: 0.5 }]}>
												<LossIcon fontSize="small" />
												Défaites
											</Typography>
										</Box>
									</Grid>
									<Grid size={{xs: 6, sm: 3}}>
										<Box textAlign="center">
											<Typography variant="h4" fontWeight={700} color="text.secondary">
												{stats.draws}
											</Typography>
											<Typography variant="body2" color="text.secondary" sx={[layoutStyles.flexCenterJustifyCenter, { mt: 0.5 }]}>
												<DrawIcon fontSize="small" />
												Égalités
											</Typography>
										</Box>
									</Grid>
									<Grid size={{xs: 12}}>
										<Divider sx={dividerStyles.standard} />
										<Box textAlign="center">
											<Typography variant="h5" fontWeight={700} sx={typographyStyles.gradientHeading}>
												{stats.winRate}%
											</Typography>
											<Typography variant="body2" color="text.secondary">
												Taux de victoire
											</Typography>
										</Box>
									</Grid>
								</Grid>
							) : (
								<Typography color="text.secondary">Aucune statistique disponible</Typography>
							)}
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
}
