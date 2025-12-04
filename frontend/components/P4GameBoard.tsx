"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Box, Paper, CircularProgress, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { ClientP4 } from "@/lib/ClientP4";
import { useGame } from "./GameContext";
import { useWebSocket } from "./WebSocketProvider";

interface P4GameBoardProps {
	roomId: string;
	setActivePlayer?: (playerNumber: number, active: boolean) => void;
}

type TokenColor = "empty" | "player1" | "player2";

const CELL_SIZE = 80;
const BOARD_COLS = 7;
const BOARD_ROWS = 6;

const P4GameBoard: React.FC<P4GameBoardProps> = ({ roomId, setActivePlayer }) => {
	const { client, isConnected } = useWebSocket();
	const { gameState, animatingTokens, handleRestart: contextHandleRestart } = useGame();
	const [winDialogOpen, setWinDialogOpen] = useState(false);
	const [winMessage, setWinMessage] = useState("");
	const setActivePlayerRef = useRef(setActivePlayer);
	
	// Synchroniser la ref avec la prop
	useEffect(() => {
		setActivePlayerRef.current = setActivePlayer;
	}, [setActivePlayer]);

	// Écouter les événements win et full pour afficher les dialogs
	useEffect(() => {
		if (!client) return;

		const handleWin = (e: CustomEvent<{ uuid: string; playerid: number }>) => {
			const isWinner = client.uuid === e.detail.uuid;
			setWinMessage(isWinner ? "🎉 Vous avez gagné !" : "😢 Vous avez perdu !");
			setWinDialogOpen(true);
		};

		const handleFull = () => {
			setWinMessage("🤝 Match nul !");
			setWinDialogOpen(true);
		};

		client.addEventListener("win", handleWin as EventListener);
		client.addEventListener("full", handleFull as EventListener);

		return () => {
			client.removeEventListener("win", handleWin as EventListener);
			client.removeEventListener("full", handleFull as EventListener);
		};
	}, [client]);

	// Note: Le join de la room est géré par le composant parent (Play.tsx)
	// Pas besoin de le gérer ici pour éviter les boucles infinies

	// Mettre à jour setActivePlayer quand currentPlayer change
	// Désactivé pour éviter les boucles infinies - sera mis à jour via les événements de jeu
	// const lastPlayerRef = useRef<number | null>(null);
	// useEffect(() => {
	// 	if (setActivePlayerRef.current && gameState.currentPlayer && lastPlayerRef.current !== gameState.currentPlayer) {
	// 		lastPlayerRef.current = gameState.currentPlayer;
	// 		setActivePlayerRef.current(gameState.currentPlayer, true);
	// 	}
	// }, [gameState.currentPlayer]);

	const handleColumnClick = (x: number) => {
		if (!client || !isConnected) {
			return;
		}

		if (gameState.isWin || gameState.isFull) {
			return;
		}

		if (!client.playerId) {
			return;
		}

		if (client.playerId !== gameState.currentPlayer) {
			return;
		}

		// Vérifier si la colonne est pleine
		const topCell = gameState.board[x][BOARD_ROWS - 1];
		if (topCell !== "empty") {
			return;
		}

		client.play(x);
	};

	const handleRestart = useCallback(() => {
		if (client && isConnected) {
			client.send("restart", { forced: true });
		}
		contextHandleRestart();
		setWinDialogOpen(false);
		if (setActivePlayer) {
			setActivePlayer(1, true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [client, isConnected, contextHandleRestart]);

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

	const canPlay = client && client.playerId !== null && !gameState.isWin && !gameState.isFull && client.playerId === gameState.currentPlayer;
	const isLoading = gameState.loading;

	return (
		<Box>
			<Paper
				elevation={4}
				sx={{
					p: 2,
					background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
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
									const y = BOARD_ROWS - 1 - row; // Inverser Y pour avoir (0,0) en bas à gauche

									// Déterminer la couleur du jeton
									const displayColor = gameState.board[x][y];
									const tokenKey = `${x}-${y}`;
									const isAnimating = animatingTokens.has(tokenKey);

									// Mettre en surbrillance le dernier coup
									const isLastMove = gameState.lastMove?.x === x && gameState.lastMove?.y === y;
									const isWinning = gameState.isWin && gameState.winningPlayer;

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
			<Dialog open={winDialogOpen} onClose={() => {}} maxWidth="sm" fullWidth>
				<DialogTitle sx={{ textAlign: "center", fontSize: "1.5rem" }}>{winMessage}</DialogTitle>
				<DialogContent>
					<Typography textAlign="center" color="text.secondary">
						{gameState.isFull ? "Le plateau est plein !" : "La partie est terminée."}
					</Typography>
				</DialogContent>
				<DialogActions sx={{ justifyContent: "center", pb: 2 }}>
					<Button
						variant="contained"
						onClick={handleRestart}
						sx={{
							background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
							"&:hover": {
								background: "linear-gradient(135deg, #4f46e5 0%, #db2777 100%)",
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
