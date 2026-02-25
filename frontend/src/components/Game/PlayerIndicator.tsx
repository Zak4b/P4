import React from "react";
import { Paper, Stack } from "@mui/material";
import { colors } from "@/lib/styles";
import { Player } from "@/store/game/types";
import PlayerCard from "./PlayerCard";

interface PlayerIndicatorProps {
	players: Player[];
	activePlayerIndex: number;
}

const PlayerIndicator: React.FC<PlayerIndicatorProps> = ({ players, activePlayerIndex }) => {
	if (!players || players.length === 0) {
		return null;
	}

	if (activePlayerIndex < 0 || activePlayerIndex >= players.length) {
		return null;
	}

	return (
		<Paper
			elevation={4}
			sx={{
				mt: { xs: 0, lg: 3 },
				p: { xs: 1.5, lg: 2.5 },
				backgroundColor: colors.dark,
				borderRadius: 3,
				overflow: "hidden",
			}}
		>
			<Stack
				direction={{ xs: "row", lg: "column" }}
				spacing={{ xs: 1, lg: 1.5 }}
				justifyContent={{ xs: "center", lg: "stretch" }}
				useFlexGap
			>
				{players.map((player, index) => {
					const isActive = index === activePlayerIndex;
					return <PlayerCard key={player.localId} player={player} isActive={isActive} />;
				})}
			</Stack>
		</Paper>
	);
};

export default PlayerIndicator;

