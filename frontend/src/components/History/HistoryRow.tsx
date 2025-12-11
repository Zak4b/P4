import { Box, Typography, Paper } from "@mui/material";
import { paperStyles } from "@/lib/styles";
import PlayerInfo from "./HistoryPlayerInfo";

type Winner = "PLAYER1" | "PLAYER2" | "DRAW";

interface HistoryCardProps {
	id: string;
	player1: { id: string; login: string; eloRating?: number };
	player2: { id: string; login: string; eloRating?: number };
	winner: Winner;
	time: number;
	duration: number;
}

const formatDate = (dateStr: string | number) => {
	return new Date(dateStr).toLocaleDateString("fr-FR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
};

const formatDuration = (seconds: number) => {
	return seconds;
};

export default function HistoryRow({
	player1,
	player2,
	winner,
	time,
	duration,
}: HistoryCardProps) {
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
			{/* Section gauche - Joueur 1 */}
			<PlayerInfo
				player={player1}
				isWinner={player1Won}
				isLoser={player2Won}
				isDraw={isDraw}
				alignRight={false}
			/>

			{/* Section centre - Date et Durée */}
			<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, flexShrink: 0 }}>
				<Typography variant="body1" fontWeight={600} color="text.primary">
					{formatDate(time)}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Durée : {formatDuration(duration)}
				</Typography>
			</Box>

			{/* Section droite - Joueur 2 */}
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

