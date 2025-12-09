import { useCallback, useEffect } from "react";
import { useWebSocket } from "@/components/WebSocketProvider";
import { SyncEvent, PlayEvent, WinEvent } from "@/lib/socketTypes";
import { useGameStore } from "../gameStore";

export const useGameWebSocket = () => {
	const { socket, isConnected, uuid, setRoomId, setPlayerId } = useWebSocket();
	const handlePlay = useGameStore((state) => state.handlePlay);
	const handleSync = useGameStore((state) => state.handleSync);
	const handleDraw = useGameStore((state) => state.handleDraw);
	const handleRestart = useGameStore((state) => state.handleRestart);
	const handleJoin = useGameStore((state) => state.handleJoin);
	const handleWin = useGameStore((state) => state.handleWin);

	// Fonction pour gérer handleWin avec accès à l'UUID
	const handleWinWithUuid = useCallback(
		(data: WinEvent) => {
			if (!uuid) return;
			const isWinner = uuid === data.uuid;
			const message = isWinner ? "🎉 Vous avez gagné !" : "😢 Vous avez perdu !";
			handleWin(message, data.playerid);
		},
		[uuid, handleWin]
	);

	// Écouter les événements Socket.IO directement
	useEffect(() => {
		if (!socket || !isConnected) return;

		// Écouter l'événement sync (qui est envoyé après un join réussi)
		const syncHandler = (data: SyncEvent) => {
			handleSync(data);
			// Mettre à jour playerId dans le contexte WebSocket
			if (data.playerId !== null) {
				setPlayerId(data.playerId);
			}
			// handleJoin sera appelé avec les données du sync
			if (data.playerId !== null) {
				// On utilise le currentRoomId du store pour le roomId
				const currentRoomId = useGameStore.getState().gameState.currentRoomId;
				if (currentRoomId) {
					setRoomId(currentRoomId);
					handleJoin(currentRoomId, data.playerId);
				}
			}
		};

		const playHandler = (data: PlayEvent) => {
			handlePlay(data);
		};

		const winHandler = (data: WinEvent) => {
			handleWinWithUuid(data);
		};

		const drawHandler = () => {
			handleDraw();
		};

		const restartHandler = () => {
			handleRestart();
		};

		// Écouter aussi game-win et game-draw (alias du backend)
		const gameWinHandler = (data: WinEvent) => {
			handleWinWithUuid(data);
		};

		const gameDrawHandler = () => {
			handleDraw();
		};

		// Enregistrer les listeners
		socket.on("sync", syncHandler);
		socket.on("play", playHandler);
		socket.on("win", winHandler);
		socket.on("game-win", gameWinHandler);
		socket.on("draw", drawHandler);
		socket.on("game-draw", gameDrawHandler);
		socket.on("restart", restartHandler);

		return () => {
			// Nettoyer les listeners
			socket.off("sync", syncHandler);
			socket.off("play", playHandler);
			socket.off("win", winHandler);
			socket.off("game-win", gameWinHandler);
			socket.off("draw", drawHandler);
			socket.off("game-draw", gameDrawHandler);
			socket.off("restart", restartHandler);
		};
	}, [socket, isConnected, handlePlay, handleSync, handleWinWithUuid, handleDraw, handleRestart, handleJoin, uuid, setRoomId, setPlayerId]);
};

