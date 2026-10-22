"use client";

import { Box, Typography } from "@mui/material";
import UserAvatar from "@/components/UserAvatar";
import UserActionsDropdown from "@/components/UserActionsDropdown";
import { useAuth } from "@/components/AuthContext";
import type { LeaderboardPlayer } from "./LeaderboardEntry";

interface Place {
	rank: 1 | 2 | 3;
	color: string;
	/** Hauteur de la marche : téléphone, puis écran large. */
	height: { xs: number; sm: number };
	avatar: { xs: number; sm: number };
}

/** Ordre d'affichage d'un vrai podium : deuxième, premier, troisième. */
const PLACES: Place[] = [
	{ rank: 2, color: "podium.silver", height: { xs: 84, sm: 140 }, avatar: { xs: 48, sm: 72 } },
	{ rank: 1, color: "podium.gold", height: { xs: 116, sm: 190 }, avatar: { xs: 60, sm: 96 } },
	{ rank: 3, color: "podium.bronze", height: { xs: 64, sm: 104 }, avatar: { xs: 44, sm: 64 } },
];

/** Rang d'arrivée sur le podium : le 1er d'abord. */
const DROP_ORDER: Record<Place["rank"], number> = { 1: 0, 2: 1, 3: 2 };

function Step({ place, player, currentUserId }: { place: Place; player: LeaderboardPlayer | undefined; currentUserId?: string }) {
	const { rank, color, height, avatar } = place;
	return (
		<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 0 }}>
			{player ? (
				<Box
					data-motion=""
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						minWidth: 0,
						maxWidth: "100%",
						mb: 1.5,
						// Le joueur tombe sur sa marche, comme un jeton dans sa colonne.
						// Le 1er tombe d'abord, puis le 2e et le 3e.
						animation: `podiumDrop 620ms ${DROP_ORDER[rank] * 140}ms both`,
					}}
				>
					{/* Clic sur le portrait : voir le profil, inviter… comme dans l'historique. */}
					<UserActionsDropdown targetUser={{ id: player.id, login: player.login }} currentUserId={currentUserId}>
						<Box sx={{ p: "4px", borderRadius: "50%", bgcolor: color, lineHeight: 0, cursor: "pointer" }}>
							<UserAvatar
								userId={player.id}
								login={player.login}
								sx={{ width: avatar, height: avatar, border: "3px solid", borderColor: "background.paper" }}
							/>
						</Box>
					</UserActionsDropdown>
					<Typography
						sx={{
							mt: 1,
							fontWeight: 700,
							fontSize: { xs: "0.9375rem", sm: rank === 1 ? "1.25rem" : "1.0625rem" },
							maxWidth: "100%",
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						}}
					>
						{player.login}
					</Typography>
					<Typography
						sx={{ color: "text.secondary", fontVariantNumeric: "tabular-nums", fontSize: { xs: "0.8125rem", sm: "0.9375rem" } }}
					>
						{player.eloRating.toLocaleString("fr-FR")} ELO
					</Typography>
				</Box>
			) : (
				<Typography sx={{ mb: 1.5, color: "text.secondary", fontSize: "0.875rem" }}>Place libre</Typography>
			)}
			<Box
				sx={{
					width: "100%",
					height,
					bgcolor: player ? color : "action.hover",
					borderRadius: "16px 16px 0 0",
					display: "flex",
					justifyContent: "center",
					pt: { xs: 1, sm: 2 },
				}}
			>
				<Typography
					sx={{
						fontSize: { xs: "2rem", sm: rank === 1 ? "4rem" : "3rem" },
						fontWeight: 700,
						lineHeight: 1,
						color: player ? "rgba(255, 255, 255, 0.92)" : "text.disabled",
					}}
				>
					{rank}
				</Typography>
			</Box>
		</Box>
	);
}

/** Le podium des trois premiers, en marches de hauteur décroissante. */
export default function Podium({ topThree }: { topThree: LeaderboardPlayer[] }) {
	const { user } = useAuth();
	return (
		<Box
			sx={{
				display: "grid",
				gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
				alignItems: "end",
				gap: { xs: 1, sm: 2 },
				maxWidth: 720,
				mx: "auto",
				mb: 4,
			}}
		>
			{PLACES.map((place) => (
				<Step key={place.rank} place={place} player={topThree[place.rank - 1]} currentUserId={user?.id} />
			))}
		</Box>
	);
}
