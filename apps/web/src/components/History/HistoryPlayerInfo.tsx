import { Box, Typography } from "@mui/material";
import UserAvatar from "../UserAvatar";
import UserActionsDropdown from "../UserActionsDropdown";
import { useAuth } from "../AuthContext";

type PlayerResult = "winner" | "loser" | "neutral";

function getPlayerResult(isWinner: boolean, isLoser: boolean): PlayerResult {
	if (isWinner) {
		return "winner";
	}
	return isLoser ? "loser" : "neutral";
}

const BORDER_COLORS: Record<PlayerResult, string> = {
	winner: "#4caf50",
	loser: "#f44336",
	neutral: "#757575",
};

const TEXT_COLORS: Record<PlayerResult, string> = {
	winner: "success.main",
	loser: "error.main",
	neutral: "text.primary",
};

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
	const result = getPlayerResult(isWinner, isLoser);
	const borderColor = BORDER_COLORS[result];
	const textColor = TEXT_COLORS[result];
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
					userId={player.id}
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
                    color={textColor}
                    sx={{
                        fontWeight: 600,
                        mb: compact ? 0 : 0.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                    }}>
					{player.login}
				</Typography>
				{!isDraw && !compact && (
					<Typography
                        variant="body2"
                        color={textColor}
                        sx={{
                            fontWeight: 600,
                            mt: 0.5
                        }}>
						{isWinner ? "Winner" : "Loser"}
					</Typography>
				)}
			</Box>
        </Box>
    );
}