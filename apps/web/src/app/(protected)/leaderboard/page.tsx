"use client";

import { Box, Container } from "@mui/material";
import { Button, Muted, PageHeader, Panel, Text } from "@/components/ui";
import { useLeaderboardQuery } from "@/lib/api/user/useUserQuery";
import { useAuth } from "@/components/AuthContext";
import Podium from "./components/Podium";
import LeaderboardEntry, { LEADERBOARD_COLUMNS } from "./components/LeaderboardEntry";

function TableHeader() {
	return (
		<Box
			sx={{
				display: "grid",
				gridTemplateColumns: LEADERBOARD_COLUMNS,
				columnGap: 2,
				px: { xs: 2, sm: 3 },
				pb: 1,
				"& > *": { fontSize: "0.8125rem", color: "text.secondary" },
			}}
		>
			<Box component="span" sx={{ textAlign: "right" }}>
				Rang
			</Box>
			<span>Joueur</span>
			<Box component="span" sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
				Niveau
			</Box>
			<Box component="span" sx={{ textAlign: "right" }}>
				ELO
			</Box>
		</Box>
	);
}

function RowSkeleton() {
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 2,
				px: 3,
				minHeight: 56,
				borderTop: "1px solid",
				borderColor: "divider",
			}}
		>
			<Box sx={{ width: 24, height: 14, borderRadius: "4px", bgcolor: "action.hover" }} />
			<Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "action.hover" }} />
			<Box sx={{ width: 140, height: 16, borderRadius: "4px", bgcolor: "action.hover" }} />
		</Box>
	);
}

export default function LeaderboardPage() {
	const { user } = useAuth();
	const leaderboardQuery = useLeaderboardQuery();
	const players = [...(leaderboardQuery.data ?? [])].sort((a, b) => b.eloRating - a.eloRating);

	return (
		<Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
			<PageHeader title="Classement" />

			{players.length > 0 && <Podium topThree={players.slice(0, 3)} />}

			<Panel data-motion="" sx={{ pt: 1.5, animation: "riseIn 420ms var(--ease-out) 60ms both" }}>
				{players.length > 0 && <TableHeader />}

				{leaderboardQuery.isLoading && [0, 1, 2, 3, 4].map((i) => <RowSkeleton key={i} />)}

				{leaderboardQuery.isError && (
					<Box
						sx={{
							px: 3,
							py: 3,
							borderTop: "1px solid",
							borderColor: "divider",
							display: "flex",
							alignItems: "center",
							gap: 2,
						}}
					>
						<Text>Impossible de charger le classement.</Text>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								leaderboardQuery.refetch().catch(() => null);
							}}
						>
							Réessayer
						</Button>
					</Box>
				)}

				{leaderboardQuery.isSuccess && players.length === 0 && (
					<Box sx={{ px: 3, py: 4, borderTop: "1px solid", borderColor: "divider" }}>
						<Muted>Personne n’est encore classé.</Muted>
					</Box>
				)}

				{players.map((player, index) => (
					<LeaderboardEntry
						key={player.id}
						player={player}
						rank={index + 1}
						isMe={player.id === user?.id}
						currentUserId={user?.id}
					/>
				))}
			</Panel>
		</Container>
	);
}
