"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { Box, CircularProgress, Alert } from "@mui/material";
import P4GameBoard from "@/components/P4GameBoard";
import PlayerIndicator from "@/components/PlayerIndicator";
import { useWebSocket } from "@/components/WebSocketProvider";
import { useGame } from "@/store/useGameStore";

export default function PlayPage() {
	const params = useParams();
	const roomId = (params?.id as string) || "1";
	const { socket, isConnected } = useWebSocket();
	const { joinRoom, gameState } = useGame();
	const lastRoomIdRef = useRef<string | null>(null);

	const [players, setPlayers] = useState([
		{ id: 1, name: "Joueur #1" },
		{ id: 2, name: "Joueur #2" },
	]);
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

	if (!socket) {
		return (
			<Box display="flex" flexDirection="column" alignItems="center" gap={2} py={4}>
				<CircularProgress />
				<Alert severity="info">Initialisation de la connexion...</Alert>
			</Box>
		);
	}

	if (!isConnected) {
		return (
			<Box display="flex" flexDirection="column" alignItems="center" gap={2} py={4}>
				<CircularProgress />
				<Alert severity="info">Connexion au serveur...</Alert>
			</Box>
		);
	}

	return (
		<Box display="flex" gap={3} alignItems="flex-start" flexWrap="wrap">
			<Box flex="0 0 260px">
				<PlayerIndicator players={players} activePlayerIndex={activePlayerIndex} />
			</Box>
			<Box flex="1 1 auto" minWidth="360px">
				<P4GameBoard roomId={roomId} setActivePlayer={handlePlayerStateChange} />
			</Box>
		</Box>
	);
}

