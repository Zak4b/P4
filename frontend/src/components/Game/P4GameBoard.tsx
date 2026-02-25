"use client";

import React, { useEffect } from "react";
import { Box, Paper, CircularProgress, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useGame } from "@/store/useGameStore";
import { useWebSocket } from "../WebSocketProvider";
import { colors, gradients } from "@/lib/styles";

interface P4GameBoardProps {
	roomId?: string;
	setActivePlayer?: (playerNumber: number, active: boolean) => void;
}

type TokenColor = "empty" | "player1" | "player2";

const BOARD_COLS = 7;
const BOARD_ROWS = 6;
/* Rapport 7:6 pour conserver les proportions (7 colonnes, 6 rangées) */
const GRID_ASPECT_RATIO = BOARD_COLS / BOARD_ROWS;

const P4GameBoard: React.FC<P4GameBoardProps> = ({ setActivePlayer }) => {
	const {
		gameState,
		animatingTokens,
		playMove,
		restart,
		winDialogOpen,
		setWinDialogOpen,
		winMessage,
	} = useGame();
	const { playerId } = useWebSocket();
	

	const handleColumnClick = (x: number) => {
		playMove(x);
	};

	const handleRestart = () => {
		restart();
		if (setActivePlayer) {
			setActivePlayer(1, true);
		}
	};

	useEffect(() => {
		setActivePlayer?.(gameState.currentPlayer, true);
	}, [gameState.currentPlayer, setActivePlayer]);

	const getTokenColor = (color: TokenColor) => {
		switch (color) {
			case "player1":
				return "#CE1D30"; // Rouge
			case "player2":
				return "#FDD334"; // Jaune
			default:
				return "#9c9c9c"; // Gris (vide)
		}
	};

	const isLoading = gameState.loading;
	const canPlay = !gameState.isWin && !gameState.isDraw && !isLoading && playerId === gameState.currentPlayer;

	return (
		<Box sx={{ width: "100%", maxWidth: "min(560px, 95vw)", mx: "auto" }}>
			<Paper
				elevation={4}
				sx={{
					p: { xs: 1, lg: 2 },
					background: gradients.background,
					borderRadius: 3,
					width: "100%",
					position: "relative",
				}}
			>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: `repeat(${BOARD_COLS}, 1fr)`,
						gridTemplateRows: `repeat(${BOARD_ROWS}, 1fr)`,
						gap: { xs: 0.5, lg: 1 },
						background: "#9c9c9c",
						p: { xs: 0.5, lg: 1 },
						borderRadius: 2,
						position: "relative",
						aspectRatio: GRID_ASPECT_RATIO,
						width: "100%",
						minHeight: 0,
					}}
				>
					{/* Grille du jeu */}
					{Array(BOARD_ROWS)
						.fill(0)
						.map((_, row) =>
							Array(BOARD_COLS)
								.fill(0)
								.map((_, col) => {
									const x = col;
									const y = BOARD_ROWS - 1 - row;

									const displayColor = gameState.board[x][y];
									const tokenKey = `${x}-${y}`;
									const isAnimating = animatingTokens.has(tokenKey);

									// Mettre en surbrillance le dernier coup
									const isLastMove = gameState.lastMove?.x === x && gameState.lastMove?.y === y;

									return (
										<Box
											key={`cell-${x}-${y}`}
											onClick={(e) => {
												e.stopPropagation();
												// Permettre de cliquer sur toute la colonne
												handleColumnClick(x);
											}}
											sx={{
												gridColumn: col + 1,
												gridRow: row + 1,
												aspectRatio: 1,
												position: "relative",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												cursor: canPlay ? "pointer" : "default",
												zIndex: 1,
												padding: "4px",
											}}
										>
											{/* Cellule vide ou jeton */}
											<Box
												sx={{
													width: "90%",
													height: "90%",
													borderRadius: "50%",
													backgroundColor: displayColor !== "empty" ? getTokenColor(displayColor) : "#e5e7eb",
													border: displayColor !== "empty" ? "none" : "2px solid #d1d5db",
													boxShadow:
														displayColor !== "empty"
															? isLastMove
																? "0 0 0 3px rgba(255,255,255,0.9), 0 0 15px rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.2)"
																: "0 2px 4px rgba(0,0,0,0.2)"
															: "inset 0 2px 4px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)",
													transition: isAnimating ? "none" : "all 0.2s ease",
													position: "absolute",
													top: "50%",
													left: "50%",
													transform: "translate(-50%, -50%)",
													animation: isAnimating ? "tokenGrow 0.4s ease-out forwards" : "none",
												}}
											/>
										</Box>
									);
								})
						)}
				</Box>

				{/* Overlay de chargement */}
				{isLoading && (
					<Box
						sx={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundColor: "rgba(255, 255, 255, 0.7)",
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
			</Paper>

			{/* Dialog de victoire/match nul */}
			<Dialog open={winDialogOpen} onClose={() => setWinDialogOpen(false)} maxWidth="sm" fullWidth>
				<DialogTitle sx={{ textAlign: "center", fontSize: "1.5rem" }}>{winMessage}</DialogTitle>
				<DialogContent>
					<Typography textAlign="center" color="text.secondary">
						{gameState.isDraw ? "Le plateau est plein !" : "La partie est terminée."}
					</Typography>
				</DialogContent>
				<DialogActions sx={{ justifyContent: "center", pb: 2 }}>
					<Button
						variant="contained"
						onClick={handleRestart}
						sx={{
							backgroundColor: colors.primary,
							"&:hover": {
								backgroundColor: colors.primaryHover,
							},
						}}
					>
						Rejouer
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default P4GameBoard;
