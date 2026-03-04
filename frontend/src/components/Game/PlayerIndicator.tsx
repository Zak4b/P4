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
				mt: 0,
				p: 1.5,
				backgroundColor: colors.dark,
				borderRadius: 3,
				overflow: "hidden",
			}}
		>
			<Stack direction="row" spacing={1.5} justifyContent="center">
				{players.map((player, index) => {
					const isActive = index === activePlayerIndex;
					return <PlayerCard key={player.localId} player={player} isActive={isActive} />;
				})}
			</Stack>
		</Paper>
	);
};

export default PlayerIndicator;
