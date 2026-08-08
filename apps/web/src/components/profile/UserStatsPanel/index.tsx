"use client";

import { Typography, Paper, Grid, Stack, Divider } from "@mui/material";
import {
	SportsEsports as GameIcon,
	TrendingUp as WinIcon,
	TrendingDown as LossIcon,
	Remove as DrawIcon,
} from "@mui/icons-material";
import { getLevelFromXp } from "@p4/leveling";
import { paperStyles, dividerStyles } from "@/lib/styles";
import { useUserQuery, useUserStatsQuery } from "@/lib/api/user/useUserQuery";
import { PanelLoading } from "@/components/profile/PanelLoading";
import { StatTile } from "./StatTile";
import { LevelProgress } from "./LevelProgress";
import { StatsSummary } from "./StatsSummary";

interface UserStatsPanelProps {
	userId: string;
}

export default function UserStatsPanel({ userId }: UserStatsPanelProps) {
	const userQuery = useUserQuery(userId);
	const statsQuery = useUserStatsQuery(userId);

	if (userQuery.isLoading || statsQuery.isLoading) {
		return <PanelLoading sx={[paperStyles.gradientCard, { height: "100%" }]} />;
	}

	const user = userQuery.data ?? null;
	const stats = statsQuery.data ?? null;
	const winrate = stats && stats.totalGames > 0 ? Math.round((stats.wins / stats.totalGames) * 100) : 0;
	const level = getLevelFromXp(user?.xp ?? 0);

	return (
		<Paper elevation={3} sx={[paperStyles.gradientCard, { height: "100%" }]}>
			<Stack spacing={3} alignItems="center" sx={{ py: 3 }}>
				{stats && user ? (
					<Grid container>
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
							<LevelProgress level={level} />
							<Divider sx={dividerStyles.standard} />

							<StatsSummary eloRating={user.eloRating} winrate={winrate} />
						</Grid>
					</Grid>
				) : (
					<Typography color="text.secondary">Aucune statistique disponible</Typography>
				)}
			</Stack>
		</Paper>
	);
}
