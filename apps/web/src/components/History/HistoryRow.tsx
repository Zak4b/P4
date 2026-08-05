import { Box, Typography, Paper } from "@mui/material";
import { paperStyles } from "@/lib/styles";
import PlayerInfo from "./HistoryPlayerInfo";
import { HistoryRowProps, formatDate, formatDuration } from "./historyRowShared";

export default function HistoryRow({
	player1,
	player2,
	winner,
	time,
	duration,
}: HistoryRowProps) {
	const player1Won = winner === "PLAYER1";
	const player2Won = winner === "PLAYER2";
	const isDraw = winner === "DRAW";

	return (
		<Paper
			elevation={3}
			sx={[
				paperStyles.gradientPaper,
				{
					borderRadius: 2,
					p: 2,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					gap: 2,
				},
			]}
		>
			<PlayerInfo
				player={player1}
				isWinner={player1Won}
				isLoser={player2Won}
				isDraw={isDraw}
				alignRight={false}
			/>

			<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, flexShrink: 0 }}>
				<Typography variant="body1" fontWeight={600} color="text.primary">
					{formatDate(time)}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Durée : {formatDuration(duration)}
				</Typography>
			</Box>

			<Box sx={{ display: "flex", justifyContent: "flex-end", flex: 1 }}>
				<PlayerInfo
					player={player2}
					isWinner={player2Won}
					isLoser={player1Won}
					isDraw={isDraw}
					alignRight={true}
				/>
			</Box>
		</Paper>
	);
}

