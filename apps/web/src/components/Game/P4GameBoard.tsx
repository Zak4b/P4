"use client";

import React, { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useGame } from "@/store/game";
import { useWebSocket } from "../WebSocketProvider";
import GameBoardGrid, { GRID_ASPECT_RATIO } from "./GameBoardGrid";
import GameOverDialog from "./GameOverDialog";

interface P4GameBoardProps {
	setActivePlayer?: (playerNumber: number, active: boolean) => void;
}

const P4GameBoard: React.FC<P4GameBoardProps> = ({ setActivePlayer }) => {
	const { gameState, animatingTokens, playMove, restart, winDialogOpen, setWinDialogOpen, winMessage } = useGame();
	const { playerId } = useWebSocket();

	const handleRestart = () => {
		restart();
		if (setActivePlayer) {
			setActivePlayer(1, true);
		}
	};

	useEffect(() => {
		setActivePlayer?.(gameState.currentPlayer, true);
	}, [gameState.currentPlayer, setActivePlayer]);

	const isLoading = gameState.loading;
	const canPlay = !gameState.isWin && !gameState.isDraw && !isLoading && playerId === gameState.currentPlayer;

	return (
		<Box
			sx={{
				width: "100%",
				maxWidth: `calc(75vh * ${GRID_ASPECT_RATIO})`,
				mx: "auto",
			}}
		>
			<Box
				sx={{
					width: "100%",
					position: "relative",
				}}
			>
				<GameBoardGrid
					gameState={gameState}
					animatingTokens={animatingTokens}
					canPlay={canPlay}
					onColumnClick={playMove}
				/>

				{/* Overlay de chargement */}
				{isLoading && (
					<Box
						sx={{
							position: "absolute",
							inset: 0,
							// Voile translucide : `opacity` atténuerait aussi le spinner.
							backgroundColor: "color-mix(in srgb, var(--mui-palette-background-default) 75%, transparent)",
							borderRadius: 3,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							zIndex: 1000,
						}}
					>
						<CircularProgress size={60} />
					</Box>
				)}
			</Box>

			{/* Dialog de victoire/match nul */}
			<GameOverDialog
				open={winDialogOpen}
				message={winMessage}
				isDraw={gameState.isDraw}
				winner={gameState.winningPlayer}
				onClose={() => setWinDialogOpen(false)}
				onRestart={handleRestart}
			/>
		</Box>
	);
};

export default P4GameBoard;
