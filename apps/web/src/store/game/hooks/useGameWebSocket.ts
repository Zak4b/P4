import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWebSocket } from "@/components/WebSocketProvider";
import type { SyncEvent, WinEvent, MatchedEvent } from "@/lib/socketTypes";
import { useGameStore } from "../gameStore";

export const useGameWebSocket = () => {
	const router = useRouter();
	const { socket, isConnected, uuid, setRoomId, setPlayerId } = useWebSocket();
	const handlePlay = useGameStore((state) => state.handlePlay);
	const handleSync = useGameStore((state) => state.handleSync);
	const handlePlayers = useGameStore((state) => state.handlePlayers);
	const handlePlayerJoined = useGameStore((state) => state.handlePlayerJoined);
	const handleDraw = useGameStore((state) => state.handleDraw);
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
		[uuid, handleWin],
	);

	// Écouter les événements Socket.IO directement
	useEffect(() => {
		if (!socket || !isConnected) return;

		// Écouter l'événement sync (qui est envoyé après un join réussi)
		const syncHandler = (data: SyncEvent) => {
			handleSync(data);
			if (data.playerId === null) return;

			// Mettre à jour playerId dans le contexte WebSocket
			setPlayerId(data.playerId);

			// On utilise le currentRoomId du store pour le roomId
			const currentRoomId = useGameStore.getState().gameState.currentRoomId;
			if (currentRoomId) {
				setRoomId(currentRoomId);
				handleJoin(currentRoomId);
			}
		};

		const matchedHandler = (data: MatchedEvent) => {
			setRoomId(data.roomId);
			setPlayerId(data.playerId);
			handleJoin(data.roomId);
			router.push(`/play/${data.roomId}`);
		};

		// Enregistrer les listeners
		socket.on("sync", syncHandler);
		socket.on("matched", matchedHandler);
		socket.on("players", handlePlayers);
		socket.on("player-joined", handlePlayerJoined);
		socket.on("play", handlePlay);
		socket.on("win", handleWinWithUuid);
		socket.on("game-win", handleWinWithUuid);
		socket.on("draw", handleDraw);
		socket.on("game-draw", handleDraw);

		return () => {
			// Nettoyer les listeners
			socket.off("sync", syncHandler);
			socket.off("matched", matchedHandler);
			socket.off("players", handlePlayers);
			socket.off("player-joined", handlePlayerJoined);
			socket.off("play", handlePlay);
			socket.off("win", handleWinWithUuid);
			socket.off("game-win", handleWinWithUuid);
			socket.off("draw", handleDraw);
			socket.off("game-draw", handleDraw);
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
		handleJoin,
		setRoomId,
		setPlayerId,
		router,
	]);
};
