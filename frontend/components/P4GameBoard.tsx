"use client";

import React, { useEffect } from "react";
import { Box, Paper, CircularProgress, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useGame } from "@/store/useGameStore";
import { useWebSocket } from "./WebSocketProvider";
import { colors, gradients } from "@/lib/styles";

interface P4GameBoardProps {
	roomId?: string;
	setActivePlayer?: (playerNumber: number, active: boolean) => void;
}

type TokenColor = "empty" | "player1" | "player2";

const CELL_SIZE = 80;
const BOARD_COLS = 7;
const BOARD_ROWS = 6;

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
		restart(true);
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

	// Déterminer si le joueur peut jouer (turn-based + pas de win/draw/loading)
	// Note: La vérification complète reste faite dans playMove côté provider
	const isLoading = gameState.loading;
	const canPlay = !gameState.isWin && !gameState.isDraw && !isLoading && playerId === gameState.currentPlayer;

	return (
		<Box>
			<Paper
				elevation={4}
				sx={{
					p: 2,
					background: gradients.background,
					borderRadius: 3,
					maxWidth: BOARD_COLS * CELL_SIZE + 32,
					mx: "auto",
					position: "relative",
				}}
			>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: `repeat(${BOARD_COLS}, 1fr)`,
						gap: 1,
						background: "#9c9c9c",
						p: 1,
						borderRadius: 2,
						position: "relative",
					}}
				>
					{/* Colonnes cliquables */}
					{Array(BOARD_COLS)
						.fill(0)
						.map((_, x) => (
							<Box
								key={`col-header-${x}`}
								onClick={(e) => {
									e.stopPropagation();
									handleColumnClick(x);
								}}
								sx={{
									gridColumn: x + 1,
									gridRow: 1,
									height: CELL_SIZE / 2,
									cursor: canPlay ? "pointer" : "default",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									borderRadius: 1,
									transition: "background 0.2s",
									position: "relative",
									zIndex: 10, // Au-dessus des cellules
									"&:hover": canPlay
										? {
												background: "rgba(99, 102, 241, 0.1)",
										  }
										: {},
								}}
							>
								{canPlay && (
									<Typography variant="caption" color="primary" fontWeight={600}>
										↓
									</Typography>
								)}
							</Box>
						))}

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
												gridRow: row + 2, // Row 2+ car la première row est pour les headers
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
