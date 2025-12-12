"use client";

import { useEffect, useMemo, useState } from "react";
import {
	Box,
	Typography,
	Paper,
	CircularProgress,
	Alert,
	Grid,
	Stack,
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
import { apiClient, UserStats } from "@/lib/api";
import {
	typographyStyles,
	paperStyles,
	avatarStyles,
	layoutStyles,
	dividerStyles,
} from "@/lib/styles";
import UserAvatar from "@/components/UserAvatar";

export default function ProfilePage() {
	const { user } = useAuth();
	const [stats, setStats] = useState<UserStats | null>(null);
	const winrate = useMemo(() => {
		return stats ? Math.round((stats.wins / stats.totalGames) * 100) : 0;
	}, [stats]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!user) return;

		const loadData = async () => {
			setIsLoading(true);
			setError("");
			try {
				const stats = await apiClient.getUserStats(user.id);
				setStats(stats);
			} catch (err) {
				setError("Failed to load account data: " + err);
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, [user]);

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
							<UserAvatar
								login={user.login}
								sx={{ ...(avatarStyles.large), ...(avatarStyles.gradientAvatar) }}
							/>
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
					<Paper
						elevation={3}
						sx={[
							paperStyles.gradientCard,
							{ height: "100%" },
						]}
					>
						<Stack spacing={3} alignItems="center">
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
										<Grid container spacing={2}>
											<Grid size={{xs: 6}}>
												<Box textAlign="center">
													<Typography variant="h5" fontWeight={700} sx={typographyStyles.gradientHeading}>
														{stats.eloRating}
													</Typography>
													<Typography variant="body2" color="text.secondary">
														ELO
													</Typography>
												</Box>
											</Grid>
											<Grid size={{xs: 6}}>
												<Box textAlign="center">
													<Typography variant="h5" fontWeight={700} sx={typographyStyles.gradientHeading}>
														{winrate}%
													</Typography>
													<Typography variant="body2" color="text.secondary">
														Taux de victoire
													</Typography>
												</Box>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
							) : (
								<Typography color="text.secondary">Aucune statistique disponible</Typography>
							)}
						</Stack>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
}
