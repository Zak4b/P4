"use client";

import React from "react";
import { Box } from "@mui/material";
import { Text, Badge } from "@/components/ui";
import { Person as PersonIcon } from "@mui/icons-material";
import type { Player } from "@/store/game";
import UserAvatar from "@/components/UserAvatar";

interface PlayerCardProps {
	player: Player;
	isActive: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, isActive }) => {
	const isPlayer1 = player.localId === 1;
	const waitingForName = player.login === null;
	const displayName = player.login ?? "En attente";

	// La carte est posée sur un panneau sombre (`surfaceInverse`) dans les deux
	// modes : ses couleurs viennent du jeton du joueur, pas du fond de page.
	const tokenVar = isPlayer1 ? "var(--mui-palette-board-player1)" : "var(--mui-palette-board-player2)";
	const bgColor = isActive ? `color-mix(in srgb, ${tokenVar} 18%, transparent)` : "rgba(255, 255, 255, 0.04)";
	const borderColor = isActive ? tokenVar : "rgba(255, 255, 255, 0.08)";
	const borderWidth = isActive ? 2 : 1;

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 1,
				p: 1,
				borderRadius: 2,
				bgcolor: bgColor,
				border: `${borderWidth}px solid ${borderColor}`,
				boxShadow: isActive ? `0 0 16px color-mix(in srgb, ${tokenVar} 35%, transparent)` : "none",
				flex: "1 1 0",
				minWidth: 0,
			}}
		>
			<UserAvatar
				userId={player.id}
				login={player.login}
				sx={{
					width: { xs: 36, lg: 48 },
					height: { xs: 36, lg: 48 },
					minWidth: { xs: 36, lg: 48 },
					bgcolor: isPlayer1 ? "board.player1" : "board.player2",
					border: isActive ? "3px solid" : "2px solid",
					borderColor: isActive ? "surfaceInverse.contrastText" : "rgba(255, 255, 255, 0.35)",
					boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.35)" : "none",
				}}
			>
				<PersonIcon sx={{ fontSize: { xs: 20, lg: 28 } }} />
			</UserAvatar>
			<Box sx={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
				<Text
					variant="subtitle1"
					sx={{
						color: waitingForName ? "surfaceInverse.mutedText" : "surfaceInverse.contrastText",
						fontWeight: isActive ? 700 : 600,
						lineHeight: 1.1,
						fontSize: { xs: "0.875rem", lg: "1rem" },
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
						...(waitingForName && {
							"@keyframes pulse": {
								"0%": { opacity: 0.6 },
								"50%": { opacity: 1 },
								"100%": { opacity: 0.6 },
							},
							animation: "pulse 1.4s ease-in-out infinite",
						}),
					}}
				>
					{displayName}
				</Text>
			</Box>
			{isActive && (
				<Badge
					sx={{
						bgcolor: tokenVar,
						color: "#0a141c",
						fontWeight: 700,
						height: { xs: 20, lg: 22 },
						fontSize: { xs: "0.7rem", lg: "0.8125rem" },
					}}
				>
					Actif
				</Badge>
			)}
		</Box>
	);
};

export default PlayerCard;
