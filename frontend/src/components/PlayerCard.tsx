"use client";

import React from "react";
import { Box, Avatar, Typography, Chip } from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import { Player } from "@/store/game/types";

interface PlayerCardProps {
	player: Player;
	isActive: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, isActive }) => {
	const isPlayer1 = player.localId === 1;
	const waitingForName = player.name === null;
	const displayName = player.name ?? "En attente";

	// Couleurs selon le joueur
	const primaryColor = isPlayer1 ? "#ef4444" : "#f59e0b";
	const bgColor = isActive ? `rgba(${isPlayer1 ? "239, 68, 68" : "245, 158, 11"}, 0.18)` : "rgba(255, 255, 255, 0.04)";
	const borderColor = isActive ? primaryColor : "rgba(255,255,255,0.08)";
	const borderWidth = isActive ? 2 : 1;

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 1.5,
				p: 1.5,
				borderRadius: 2,
				bgcolor: bgColor,
				border: `${borderWidth}px solid ${borderColor}`,
				boxShadow: isActive ? `0 0 16px rgba(${isPlayer1 ? "239, 68, 68" : "245, 158, 11"}, 0.35)` : "none",
			}}
		>
			<Avatar
				sx={{
					width: 48,
					height: 48,
					bgcolor: isPlayer1 ? "error.main" : "warning.main",
					border: isActive ? "3px solid white" : "2px solid rgba(255,255,255,0.35)",
					boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.35)" : "none",
				}}
			>
				<PersonIcon />
			</Avatar>
			<Box sx={{ flex: 1 }}>
				<Typography
					variant="subtitle1"
					sx={{
						color: waitingForName ? "rgba(255,255,255,0.7)" : "white",
						fontWeight: isActive ? 700 : 600,
						lineHeight: 1.1,
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
				</Typography>
			</Box>
			{isActive && (
				<Chip
					label="Actif"
					size="small"
					sx={{
						bgcolor: isPlayer1 ? "error.dark" : "warning.dark",
						color: "white",
						fontWeight: 700,
						height: 22,
					}}
				/>
			)}
		</Box>
	);
};

export default PlayerCard;
