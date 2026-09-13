import { Box, Paper } from "@mui/material";
import { Text, Muted } from "@/components/ui";
import { paperStyles } from "@/lib/styles";
import PlayerInfo from "./HistoryPlayerInfo";
import { type Match, formatDate } from "./historyRowShared";

export default function HistoryRowCompact({
	player1,
	player2,
	winner,
	time,
	duration,
}: Match) {
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
					p: 1.5,
					display: "flex",
					flexDirection: "column",
					gap: 1.5,
				},
			]}
		>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<Text
                    size="sm"
                    sx={{
                        fontWeight: 600,
                        color: "text.primary"
                    }}>
					{formatDate(time)}
				</Text>
				<Muted variant="caption">{duration} s</Muted>
			</Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
				<Box sx={{ flex: 1, minWidth: 0 }}>
					<PlayerInfo
						player={player1}
						isWinner={player1Won}
						isLoser={player2Won}
						isDraw={isDraw}
						alignRight={false}
						compact
					/>
				</Box>
				<Muted
                    variant="caption"
                    sx={{
                        fontWeight: 600,
                        flexShrink: 0,
                        px: 0.5
                    }}>
					vs
				</Muted>
				<Box sx={{ flex: 1, minWidth: 0 }}>
					<PlayerInfo
						player={player2}
						isWinner={player2Won}
						isLoser={player1Won}
						isDraw={isDraw}
						alignRight={true}
						compact
					/>
				</Box>
			</Box>
        </Paper>
    );
}
