import { Box, Typography, Stack } from "@mui/material";
import UserAvatar from "../UserAvatar";

interface PlayerInfoProps {
	player: { id: string; login: string; eloRating?: number };
	isWinner: boolean;
	isLoser: boolean;
	isDraw: boolean;
	alignRight?: boolean;
}

export default function PlayerInfo({ player, isWinner, isLoser, isDraw, alignRight = false }: PlayerInfoProps) {
	const borderColor = isWinner ? "#4caf50" : isLoser ? "#f44336" : "#757575";
	const textColor = isWinner ? "success.main" : isLoser ? "error.main" : "text.primary";

	return (
		<Box 
			sx={{ 
				display: "flex", 
				flexDirection: alignRight ? "row-reverse" : "row",
				alignItems: "center", 
				gap: 2,
				...(alignRight ? {} : { flex: 1 }),
			}}
		>
			<UserAvatar
				login={player.login}
				size={60}
				sx={{
					border: `3px solid ${borderColor}`,
				}}
			/>
			<Box sx={{ textAlign: alignRight ? "right" : "left" }}>
				<Typography 
					variant="body2" 
					fontWeight={600} 
					color={textColor} 
					sx={{ mb: 0.5 }}
				>
					{player.login}
				</Typography>
				<Stack direction="row" spacing={1} alignItems="center">
				</Stack>
				{!isDraw && (
					<Typography variant="body2" fontWeight={600} color={textColor} sx={{ mt: 0.5 }}>
						{isWinner ? "Winner" : "Loser"}
					</Typography>
				)}
			</Box>
		</Box>
	);
}