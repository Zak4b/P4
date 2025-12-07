"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Box, CircularProgress, Alert } from "@mui/material";
import P4GameBoard from "@/components/P4GameBoard";
import PlayerIndicator from "@/components/PlayerIndicator";
import { useWebSocket } from "@/components/WebSocketProvider";
import { useGame } from "@/components/GameContext";

export default function PlayPage() {
	const searchParams = useSearchParams();
	const roomId = searchParams?.get("roomId") || "1";
	const { client, isConnected } = useWebSocket();
	const { joinRoom, gameState } = useGame();
	const lastRoomIdRef = useRef<string | null>(null);

	const [players, setPlayers] = useState([
		{ id: 1, name: "Joueur #1" },
		{ id: 2, name: "Joueur #2" },
	]);
	const [activePlayerIndex, setActivePlayerIndex] = useState(0);

	useEffect(() => {
		if (!roomId || !client || !isConnected) return;
		
		// Si on est déjà dans cette room et que le jeu n'est pas en chargement, ne rien faire
		if (lastRoomIdRef.current === roomId || (gameState.currentRoomId === roomId && !gameState.loading)) {
			return;
		}
		
		lastRoomIdRef.current = roomId;
		joinRoom(roomId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [roomId, client, isConnected, gameState.currentRoomId, gameState.loading]);

	const handlePlayerStateChange = useCallback((playerNumber: number, active: boolean) => {
		if (active) {
			setActivePlayerIndex(playerNumber - 1);
		}
	}, []);

	if (!client) {
		return (
			<Box display="flex" flexDirection="column" alignItems="center" gap={2} py={4}>
				<CircularProgress />
				<Alert severity="info">Initialisation du client...</Alert>
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
		<Box>
			<P4GameBoard roomId={roomId} setActivePlayer={handlePlayerStateChange} />
			<PlayerIndicator players={players} activePlayerIndex={activePlayerIndex} />
		</Box>
	);
}
