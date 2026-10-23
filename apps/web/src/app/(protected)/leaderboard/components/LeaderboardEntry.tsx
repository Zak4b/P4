"use client";

import { Box } from "@mui/material";
import { getLevelFromXp } from "@p4/leveling";
import { Text, Muted, Token, type TokenTone } from "@/components/ui";
import UserAvatar from "@/components/UserAvatar";
import UserActionsDropdown from "@/components/UserActionsDropdown";

interface LeaderboardPlayer {
	id: string;
	username: string;
	eloRating: number;
	xp?: number;
}

const MEDAL: Partial<Record<number, TokenTone>> = { 1: "gold", 2: "silver", 3: "bronze" };

/** Rang, joueur, niveau, ELO : partagé par l'en-tête et les lignes. */
export const LEADERBOARD_COLUMNS = { xs: "40px 1fr 72px", sm: "56px 1fr 80px 96px" };

interface LeaderboardEntryProps {
	player: LeaderboardPlayer;
	rank: number;
	isMe: boolean;
	currentUserId?: string;
}

/** Une ligne du classement. La sienne est teintée, et marquée « Toi ». */
export default function LeaderboardEntry({ player, rank, isMe, currentUserId }: LeaderboardEntryProps) {
	const medal = MEDAL[rank];
	return (
		<Box
			sx={{
				display: "grid",
				gridTemplateColumns: LEADERBOARD_COLUMNS,
				alignItems: "center",
				columnGap: 2,
				px: { xs: 2, sm: 3 },
				minHeight: 56,
				borderTop: "1px solid",
				borderColor: "divider",
				bgcolor: isMe ? "tint.primary" : "transparent",
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1 }}>
				{medal && <Token tone={medal} size={12} />}
				<Text sx={{ fontVariantNumeric: "tabular-nums", fontWeight: medal ? 600 : 400, color: medal ? "text.primary" : "text.secondary" }}>
					{rank}
				</Text>
			</Box>
			<Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
				<UserActionsDropdown targetUser={{ id: player.id, username: player.username }} currentUserId={currentUserId}>
					<Box sx={{ lineHeight: 0, cursor: "pointer" }}>
						<UserAvatar userId={player.id} username={player.username} size={32} />
					</Box>
				</UserActionsDropdown>
				<Text sx={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{player.username}</Text>
				{isMe && (
					<Muted component="span" sx={{ fontSize: "0.8125rem", flex: "none" }}>
						Toi
					</Muted>
				)}
			</Box>
			<Muted sx={{ display: { xs: "none", sm: "block" }, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
				{player.xp === undefined ? "—" : getLevelFromXp(player.xp).level}
			</Muted>
			<Text sx={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
				{player.eloRating.toLocaleString("fr-FR")}
			</Text>
		</Box>
	);
}

export type { LeaderboardPlayer };
