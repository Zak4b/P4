"use client";

import { Box, Typography, Paper, Grid, Stack, Divider } from "@mui/material";
import {
	EmojiEvents as TrophyIcon,
	SportsEsports as GameIcon,
	TrendingUp as WinIcon,
	TrendingDown as LossIcon,
	Remove as DrawIcon,
} from "@mui/icons-material";
import type { UserProfile } from "@p4/schemas/user";
import { getLevelFromXp } from "@p4/leveling";
import { typographyStyles, paperStyles, layoutStyles, dividerStyles } from "@/lib/styles";

interface StatTileProps {
	value: number;
	label: string;
	icon: React.ReactNode;
	color: string;
}

function StatTile({ value, label, icon, color }: StatTileProps) {
	return (
		<Grid size={{ xs: 6, sm: 3 }}>
			<Box textAlign="center">
				<Typography variant="h4" fontWeight={700} color={color}>
					{value}
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={[layoutStyles.flexCenterJustifyCenter, { mt: 0.5 }]}>
					{icon}
					{label}
				</Typography>
			</Box>
		</Grid>
	);
}

export default function UserStatsPanel({ profile }: { profile: UserProfile | null }) {
	const stats = profile?.stats ?? null;
	const winrate = stats && stats.totalGames > 0 ? Math.round((stats.wins / stats.totalGames) * 100) : 0;
	const level = getLevelFromXp(profile?.xp ?? 0);

	return (
		<Paper elevation={3} sx={[paperStyles.gradientCard, { height: "100%" }]}>
			<Stack spacing={3} alignItems="center" sx={{ py: 2 }}>
				<Typography variant="h6" fontWeight={600} gutterBottom sx={layoutStyles.flexCenter}>
					<TrophyIcon color="primary" />
					Statistiques de jeu
				</Typography>
				<Divider sx={dividerStyles.standard} />
				{stats ? (
					<Grid container spacing={3}>
						<StatTile value={stats.totalGames} label="Parties" icon={<GameIcon fontSize="small" />} color="primary" />
						<StatTile value={stats.wins} label="Victoires" icon={<WinIcon fontSize="small" />} color="success.main" />
						<StatTile value={stats.losses} label="Défaites" icon={<LossIcon fontSize="small" />} color="error.main" />
						<StatTile
							value={stats.draws}
							label="Égalités"
							icon={<DrawIcon fontSize="small" />}
							color="text.secondary"
						/>
						<Grid size={{ xs: 12 }}>
							<Divider sx={dividerStyles.standard} />
							<Box sx={{ mb: 2, px: 6, display: "flex", alignItems: "center", gap: 2 }}>
								<Typography variant="subtitle1" fontWeight={600} sx={{ width: 90, flexShrink: 0 }}>
									Niveau {level.level}
								</Typography>
								<Box
									sx={{
										flex: 1,
										minWidth: 0,
										height: 8,
										borderRadius: 1,
										overflow: "hidden",
										border: "1px solid",
										borderColor: "primary.main",
									}}
								>
									<Box
										sx={{
											height: "100%",
											width: `${level.progressPercent}%`,
											background: "linear-gradient(90deg, #6366f1 0%, #ec4899 100%)",
											borderRadius: 1,
										}}
									/>
								</Box>
								<Typography
									variant="caption"
									color="text.secondary"
									sx={{ width: 70, flexShrink: 0, ml: "auto", textAlign: "right" }}
								>
									{level.xpInCurrentLevel}/{level.xpRequiredForNextLevel}
								</Typography>
							</Box>
							<Grid container spacing={2}>
								<Grid size={{ xs: 6 }}>
									<Box textAlign="center">
										<Typography variant="h5" fontWeight={700} sx={typographyStyles.gradientHeading}>
											{profile?.eloRating}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											ELO
										</Typography>
									</Box>
								</Grid>
								<Grid size={{ xs: 6 }}>
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
	);
}
