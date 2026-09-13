"use client";

import { Box, Typography, Paper, type SxProps, type Theme } from "@mui/material";
import type { ReactNode } from "react";
import UserAvatar from "@/components/UserAvatar";

interface EntryPaperStyleOptions {
	background?: string;
	border?: string;
	isMedal: boolean;
	hasPlayer: boolean;
}

const hoverOpacity = (hasPlayer: boolean, isMedal: boolean) => {
	if (!hasPlayer) {
		return 0.5;
	}
	return isMedal ? 0.9 : 1;
};

const entryPaperStyles = ({
	background,
	border,
	isMedal,
	hasPlayer,
}: EntryPaperStyleOptions): SxProps<Theme> => ({
	p: 2,
	display: "flex",
	alignItems: "center",
	gap: 2,
	background,
	border,
	...(isMedal && { color: "podium.ink" }),
	opacity: hasPlayer ? 1 : 0.5,
	transition: isMedal ? "opacity 0.2s ease-in-out" : "background-color 0.2s ease-in-out",
	"&:hover": {
		...(isMedal ? {} : { backgroundColor: "action.hover" }),
		opacity: hoverOpacity(hasPlayer, isMedal),
	},
});

const rankTextStyles = (isMedal: boolean) => ({
	fontWeight: 700,
	color: isMedal ? "podium.inkMuted" : "text.secondary",
});

const eloValueStyles = (isMedal: boolean) => ({
	fontWeight: 700,
	color: isMedal ? "podium.ink" : "primary.main",
});

const eloLabelStyles = (isMedal: boolean) => ({
	color: isMedal ? "podium.inkMuted" : "text.secondary",
});

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

export default function LeaderboardEntry({
	player,
	rank,
	icon,
	background,
	border,
	elevation = 1,
	avatarSize = 50,
}: LeaderboardEntryProps) {
	const isMedal = background !== undefined;
	return (
		<Paper
			elevation={elevation}
			sx={entryPaperStyles({ background, border, isMedal, hasPlayer: player !== undefined })}
		>
			<Box sx={{ minWidth: 40, textAlign: "center", display: "flex", alignItems: "center", gap: 1 }}>
				{icon}
				<Typography variant="h6" sx={rankTextStyles(isMedal)}>
					#{rank}
				</Typography>
			</Box>
			{player ? (
				<UserAvatar userId={player.id} login={player.login} sx={{ width: avatarSize, height: avatarSize }} />
			) : (
				<Box sx={{ width: avatarSize, height: avatarSize, borderRadius: "50%", bgcolor: "action.hover" }} />
			)}
			<Box sx={{ flexGrow: 1, minHeight: 24 }}>
				<Typography
					variant="body1"
					sx={{
						fontWeight: 600,
					}}
				>
					{player?.login ?? "\u00A0"}
				</Typography>
			</Box>
			<Box sx={{ textAlign: "right", minHeight: 36 }}>
				<Typography variant="h6" sx={eloValueStyles(isMedal)}>
					{player != null ? player.eloRating : "\u00A0"}
				</Typography>
				<Typography variant="caption" sx={eloLabelStyles(isMedal)}>
					ELO
				</Typography>
			</Box>
		</Paper>
	);
}

export type { LeaderboardPlayer };
