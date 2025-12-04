import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, CircularProgress, Alert } from "@mui/material";
import P4GameBoard from "../components/P4GameBoard";
import PlayerIndicator from "../components/PlayerIndicator";
import { useWebSocket } from "../components/WebSocketProvider";
import { useGame } from "../components/GameContext";

const GamePage: React.FC = () => {
	const [searchParams] = useSearchParams();
	const roomId = searchParams.get("roomId") || "1";
	const { client, isConnected } = useWebSocket();
	const { joinRoom, gameState } = useGame();

	const [playerStates, setPlayerStates] = useState({
		player1: { active: false, name: "Joueur #1", id: 1 },
		player2: { active: false, name: "Joueur #2", id: 2 },
	});

	// Rejoindre la room quand roomId change
	useEffect(() => {
		if (roomId) {
			joinRoom(roomId);
		}
	}, [roomId, joinRoom]);

	const handlePlayerStateChange = (playerNumber: number, active: boolean) => {
		setPlayerStates((prev) => {
			// Si un joueur devient actif, l'autre devient inactif
			if (active) {
				return {
					player1: {
						...prev.player1,
						active: playerNumber === 1,
					},
					player2: {
						...prev.player2,
						active: playerNumber === 2,
					},
				};
			}
			// Sinon, juste mettre à jour le joueur concerné
			return {
				...prev,
				[`player${playerNumber}`]: {
					...prev[`player${playerNumber}` as keyof typeof prev],
					active,
				},
			};
		});
	};

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
			<PlayerIndicator player1={playerStates.player1} player2={playerStates.player2} />
		</Box>
	);
};

export default GamePage;
