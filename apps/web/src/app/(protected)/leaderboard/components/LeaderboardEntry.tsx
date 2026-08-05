"use client";

import { Box, Typography, Paper } from "@mui/material";
import { ReactNode } from "react";
import UserAvatar from "@/components/UserAvatar";

interface LeaderboardPlayer {
	id: string;
	login: string;
	eloRating: number;
	xp?: number;
	level?: number;
}

interface LeaderboardEntryProps {
	player: LeaderboardPlayer | undefined;
	rank: number;
	icon?: ReactNode;
	background?: string;
	border?: string;
	elevation?: number;
	avatarSize?: number;
}

export default function LeaderboardEntry({ player, rank, icon, background = "rgba(255, 255, 255, 0.7)", border, elevation = 1, avatarSize = 50 }: LeaderboardEntryProps) {
	return (
		<Paper
			elevation={elevation}
			sx={{
				p: 2,
				display: "flex",
				alignItems: "center",
				gap: 2,
				background: background,
				border: border,
				opacity: player ? 1 : 0.5,
				"&:hover": {
					background: background === "rgba(255, 255, 255, 0.7)" ? "rgba(255, 255, 255, 0.9)" : background,
					transition: background === "rgba(255, 255, 255, 0.7)" ? "background-color 0.2s ease-in-out" : "opacity 0.2s ease-in-out",
					opacity: player ? (background === "rgba(255, 255, 255, 0.7)" ? 1 : 0.9) : 0.5,
				},
			}}
		>
			<Box sx={{ minWidth: 40, textAlign: "center", display: "flex", alignItems: "center", gap: 1 }}>
				{icon}
				<Typography variant="h6" fontWeight={700} color="text.secondary">
					#{rank}
				</Typography>
			</Box>
			{player ? (
				<UserAvatar login={player.login} sx={{ width: avatarSize, height: avatarSize }} />
			) : (
				<Box sx={{ width: avatarSize, height: avatarSize, borderRadius: "50%", bgcolor: "action.hover" }} />
			)}
			<Box sx={{ flexGrow: 1, minHeight: 24 }}>
				<Typography variant="body1" fontWeight={600}>
					{player?.login ?? "\u00A0"}
				</Typography>
			</Box>
			<Box sx={{ textAlign: "right", minHeight: 36 }}>
				<Typography variant="h6" fontWeight={700} color="primary">
					{player != null ? player.eloRating : "\u00A0"}
				</Typography>
				<Typography variant="caption" color="text.secondary">
					ELO
				</Typography>
			</Box>
		</Paper>
	);
}

export type { LeaderboardPlayer };
