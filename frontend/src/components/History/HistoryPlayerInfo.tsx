import { Box, Typography, Stack } from "@mui/material";
import UserAvatar from "../UserAvatar";
import UserActionsDropdown from "../UserActionsDropdown";
import { useAuth } from "../AuthContext";

interface PlayerInfoProps {
	player: { id: string; login: string; eloRating?: number };
	isWinner: boolean;
	isLoser: boolean;
	isDraw: boolean;
	alignRight?: boolean;
	compact?: boolean;
}

export default function PlayerInfo({ player, isWinner, isLoser, isDraw, alignRight = false, compact = false }: PlayerInfoProps) {
	const { user } = useAuth();
	const borderColor = isWinner ? "#4caf50" : isLoser ? "#f44336" : "#757575";
	const textColor = isWinner ? "success.main" : isLoser ? "error.main" : "text.primary";
	const avatarSize = compact ? 36 : 60;

	return (
		<Box 
			sx={{ 
				display: "flex", 
				flexDirection: alignRight ? "row-reverse" : "row",
				alignItems: "center", 
				gap: compact ? 1 : 2,
				...(alignRight ? {} : { flex: 1 }),
			}}
		>
			<UserActionsDropdown
				targetUser={{ id: player.id, login: player.login }}
				currentUserId={user?.id}
				anchorOrigin={{
					horizontal: alignRight ? "right" : "left",
					vertical: "bottom",
				}}
				transformOrigin={{
					horizontal: alignRight ? "right" : "left",
					vertical: "top",
				}}
			>
				<UserAvatar
					login={player.login}
					size={avatarSize}
					sx={{
						border: `3px solid ${borderColor}`,
						cursor: "pointer",
						transition: "opacity 0.2s",
						"&:hover": { opacity: 0.85 },
					}}
				/>
			</UserActionsDropdown>
			<Box sx={{ textAlign: alignRight ? "right" : "left", minWidth: 0 }}>
				<Typography 
					variant={compact ? "caption" : "body2"}
					fontWeight={600} 
					color={textColor} 
					sx={{ mb: compact ? 0 : 0.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
				>
					{player.login}
				</Typography>
				{!compact && (
					<Stack direction="row" spacing={1} alignItems="center">
					</Stack>
				)}
				{!isDraw && !compact && (
					<Typography variant="body2" fontWeight={600} color={textColor} sx={{ mt: 0.5 }}>
						{isWinner ? "Winner" : "Loser"}
					</Typography>
				)}
			</Box>
		</Box>
	);
}