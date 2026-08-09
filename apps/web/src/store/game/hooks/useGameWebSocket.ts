import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWebSocket } from "@/components/WebSocketProvider";
import type { ServerMessageData } from "@p4/schemas/realtime";
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
		(data: ServerMessageData<"game:p4:win">) => {
			if (!uuid) {
				return;
			}
			const isWinner = uuid === data.uuid;
			const message = isWinner ? "🎉 Vous avez gagné !" : "😢 Vous avez perdu !";
			handleWin(message, data.playerid);
		},
		[uuid, handleWin],
	);

	// Écouter les événements Socket.IO directement
	useEffect(() => {
		if (!socket || !isConnected) {
			return;
		}

		// Écouter l'événement sync (qui est envoyé après un join réussi)
		const syncHandler = (data: ServerMessageData<"game:p4:sync">) => {
			handleSync(data);
			if (data.playerId === null) {
				return;
			}

			// Mettre à jour playerId dans le contexte WebSocket
			setPlayerId(data.playerId);

			// On utilise le currentRoomId du store pour le roomId
			const currentRoomId = useGameStore.getState().gameState.currentRoomId;
			if (currentRoomId) {
				setRoomId(currentRoomId);
				handleJoin(currentRoomId);
			}
		};

		const matchedHandler = (data: ServerMessageData<"game:p4:matchmaking:matched">) => {
			setRoomId(data.roomId);
			setPlayerId(data.playerId);
			handleJoin(data.roomId);
			router.push(`/play/${data.roomId}`);
		};

		// Enregistrer les listeners
		socket.on("game:p4:sync", syncHandler);
		socket.on("game:p4:matchmaking:matched", matchedHandler);
		socket.on("game:p4:players", handlePlayers);
		socket.on("game:p4:player-joined", handlePlayerJoined);
		socket.on("game:p4:play", handlePlay);
		socket.on("game:p4:win", handleWinWithUuid);
		socket.on("game:p4:draw", handleDraw);

		return () => {
			// Nettoyer les listeners
			socket.off("game:p4:sync", syncHandler);
			socket.off("game:p4:matchmaking:matched", matchedHandler);
			socket.off("game:p4:players", handlePlayers);
			socket.off("game:p4:player-joined", handlePlayerJoined);
			socket.off("game:p4:play", handlePlay);
			socket.off("game:p4:win", handleWinWithUuid);
			socket.off("game:p4:draw", handleDraw);
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
