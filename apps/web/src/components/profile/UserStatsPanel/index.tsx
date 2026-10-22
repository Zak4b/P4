"use client";

import { Box } from "@mui/material";
import { Muted, Panel, PanelHeader, StatStrip, Text } from "@/components/ui";
import { getLevelFromXp } from "@p4/leveling";
import { useUserQuery, useUserStatsQuery } from "@/lib/api/user/useUserQuery";
import { PanelLoading } from "@/components/profile/PanelLoading";
import { LevelProgress } from "./LevelProgress";

interface UserStatsPanelProps {
	userId: string;
}

/** Le niveau d'un joueur : l'ELO en tête, puis le bilan et la progression. */
export default function UserStatsPanel({ userId }: UserStatsPanelProps) {
	const userQuery = useUserQuery(userId);
	const statsQuery = useUserStatsQuery(userId);

	if (userQuery.isLoading || statsQuery.isLoading) {
		return <PanelLoading />;
	}

	const user = userQuery.data ?? null;
	const stats = statsQuery.data ?? null;

	if (!stats || !user) {
		return (
			<Panel sx={{ height: "100%" }}>
				<PanelHeader title="Statistiques" />
				<Muted sx={{ px: 3, pb: 3 }}>Aucune statistique disponible.</Muted>
			</Panel>
		);
	}

	const winRate = stats.totalGames > 0 ? ((stats.wins / stats.totalGames) * 100).toFixed(0) : null;

	return (
		<Panel sx={{ height: "100%" }}>
			<PanelHeader title="Statistiques" />
			<Box sx={{ px: { xs: 2, sm: 3 }, pb: 3, display: "flex", flexDirection: "column", gap: 3 }}>
				<Box sx={{ display: "flex", alignItems: "baseline", gap: 3, flexWrap: "wrap" }}>
					<Box>
						<Muted sx={{ fontSize: "0.875rem" }}>Classement</Muted>
						<Text sx={{ fontSize: "2.25rem", fontWeight: 600, lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}>
							{user.eloRating.toLocaleString("fr-FR")}
							<Box component="span" sx={{ ml: 0.75, fontSize: "1rem", fontWeight: 400, color: "text.secondary" }}>
								ELO
							</Box>
						</Text>
					</Box>
					<Box>
						<Muted sx={{ fontSize: "0.875rem" }}>Taux de victoire</Muted>
						<Text sx={{ fontSize: "1.5rem", fontWeight: 500, lineHeight: 1.3, fontVariantNumeric: "tabular-nums" }}>
							{winRate ?? "—"}
							{winRate && (
								<Box component="span" sx={{ ml: 0.5, fontSize: "0.875rem", color: "text.secondary" }}>
									%
								</Box>
							)}
						</Text>
					</Box>
				</Box>

				<StatStrip
					stats={[
						{ label: "Parties", value: stats.totalGames },
						{ label: "Victoires", value: stats.wins },
						{ label: "Défaites", value: stats.losses },
						{ label: "Nuls", value: stats.draws },
					]}
				/>

				<LevelProgress level={getLevelFromXp(user.xp)} />
			</Box>
		</Panel>
	);
}
