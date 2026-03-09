import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWebSocket } from "@/components/WebSocketProvider";
import { SyncEvent, PlayEvent, WinEvent, MatchedEvent } from "@/lib/socketTypes";
import { useGameStore } from "../gameStore";

export const useGameWebSocket = () => {
	const router = useRouter();
	const { socket, isConnected, uuid, playerId, setRoomId, setPlayerId } = useWebSocket();
	const handlePlay = useGameStore((state) => state.handlePlay);
	const handleSync = useGameStore((state) => state.handleSync);
	const handlePlayers = useGameStore((state) => state.handlePlayers);
	const handlePlayerJoined = useGameStore((state) => state.handlePlayerJoined);
	const handleDraw = useGameStore((state) => state.handleDraw);
	const handleRestart = useGameStore((state) => state.handleRestart);
	const handleJoin = useGameStore((state) => state.handleJoin);
	const handleWin = useGameStore((state) => state.handleWin);

	// Fonction pour gérer handleWin avec accès à l'UUID
	const handleWinWithUuid = useCallback(
		(data: WinEvent) => {
			const isWinner = playerId === data.playerid;
			const message = isWinner ? "🎉 Vous avez gagné !" : "😢 Vous avez perdu !";
			handleWin(message, data.playerid);
		},
		[playerId, handleWin],
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

		const gameWinHandler = (data: WinEvent) => {
			handleWinWithUuid(data);
		};

		const gameDrawHandler = () => {
			handleDraw();
		};

		const playersHandler = (data: { localId: number; name: string }[]) => {
			handlePlayers(data);
		};

		const playerJoinedHandler = (data: { localId: number; name: string }) => {
			handlePlayerJoined(data);
		};

		const matchedHandler = (data: MatchedEvent) => {
			setRoomId(data.roomId);
			setPlayerId(data.playerId);
			handleJoin(data.roomId, data.playerId);
			router.push(`/play/${data.roomId}`);
		};

		// Enregistrer les listeners
		socket.on("sync", syncHandler);
		socket.on("matched", matchedHandler);
		socket.on("players", playersHandler);
		socket.on("player-joined", playerJoinedHandler);
		socket.on("play", playHandler);
		socket.on("win", winHandler);
		socket.on("game-win", gameWinHandler);
		socket.on("draw", drawHandler);
		socket.on("game-draw", gameDrawHandler);

		return () => {
			// Nettoyer les listeners
			socket.off("sync", syncHandler);
			socket.off("matched", matchedHandler);
			socket.off("players", playersHandler);
			socket.off("player-joined", playerJoinedHandler);
			socket.off("play", playHandler);
			socket.off("win", winHandler);
			socket.off("game-win", gameWinHandler);
			socket.off("draw", drawHandler);
			socket.off("game-draw", gameDrawHandler);
		};
	}, [
		socket,
		isConnected,
		handlePlay,
		handleSync,
		handlePlayers,
		handlePlayerJoined,
		handleWinWithUuid,
		handleDraw,
		handleRestart,
		handleJoin,
		setRoomId,
		setPlayerId,
		router,
	]);
};
