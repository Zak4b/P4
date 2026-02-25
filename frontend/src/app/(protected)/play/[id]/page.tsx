"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { Box, CircularProgress, Alert } from "@mui/material";
import P4GameBoard from "@/components/Game/P4GameBoard";
import PlayerIndicator from "@/components/Game/PlayerIndicator";
import { useWebSocket } from "@/components/WebSocketProvider";
import { useGame } from "@/store/useGameStore";

export default function PlayPage() {
	const params = useParams();
	const roomId = (params?.id as string) || "1";
	const { socket, isConnected } = useWebSocket();
	const { joinRoom, gameState, players } = useGame();
	const lastRoomIdRef = useRef<string | null>(null);

	const [activePlayerIndex, setActivePlayerIndex] = useState(0);

	useEffect(() => {
		if (!roomId || !socket || !isConnected) return;
		
		// Si on est déjà dans cette room et que le jeu n'est pas en chargement, ne rien faire
		if (lastRoomIdRef.current === roomId || (gameState.currentRoomId === roomId && !gameState.loading)) {
			return;
		}
		
		lastRoomIdRef.current = roomId;
		joinRoom(roomId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [roomId, socket, isConnected, gameState.currentRoomId, gameState.loading]);

	const handlePlayerStateChange = useCallback((playerNumber: number, active: boolean) => {
		if (active) {
			setActivePlayerIndex(playerNumber - 1);
		}
	}, []);

	if (!isConnected) {
		return (
			<Box display="flex" flexDirection="column" alignItems="center" gap={2} py={4}>
				<CircularProgress />
				<Alert severity="info">Connexion au serveur...</Alert>
			</Box>
		);
	}

	return (
		<Box
			display="flex"
			flexDirection={{ xs: "column", lg: "row" }}
			gap={{ xs: 2, lg: 3 }}
			alignItems={{ xs: "stretch", lg: "flex-start" }}
			width="100%"
		>
			{/* Grille en premier jusqu'à lg, à droite sur lg+ */}
			<Box order={{ xs: 1, lg: 2 }} flex={{ lg: "1 1 auto" }} minWidth={0}>
				<P4GameBoard roomId={roomId} setActivePlayer={handlePlayerStateChange} />
			</Box>
			{/* Indicateur joueur sous la grille jusqu'à lg, à gauche sur lg+ — même largeur que la grille en colonne */}
			<Box
				order={{ xs: 2, lg: 1 }}
				flex={{ lg: "0 0 260px" }}
				width={{ xs: "100%", lg: "auto" }}
				sx={{
					maxWidth: { xs: "min(560px, 95vw)", lg: "none" },
					mx: { xs: "auto", lg: 0 },
				}}
			>
				<PlayerIndicator players={players} activePlayerIndex={activePlayerIndex} />
			</Box>
		</Box>
	);
}

