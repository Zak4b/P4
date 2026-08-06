import { useCallback, useEffect, useRef } from "react";
import { useWebSocket } from "@/components/WebSocketProvider";
import { useGameStore } from "../gameStore";
import { BOARD_ROWS } from "../constants";
import { getCell } from "../utils";
import type { JoinAck } from "@p4/schemas/realtime";

export const useGame = () => {
	const { socket, isConnected, playerId } = useWebSocket();
	const gameState = useGameStore((state) => state.gameState);
	const animatingTokens = useGameStore((state) => state.animatingTokens);
	const winDialogOpen = useGameStore((state) => state.winDialogOpen);
	const winMessage = useGameStore((state) => state.winMessage);
	const players = useGameStore((state) => state.players);
	const setLoading = useGameStore((state) => state.setLoading);
	const setWinDialogOpen = useGameStore((state) => state.setWinDialogOpen);
	const currentRoomIdRef = useRef<string | null>(null);

	// Synchroniser la ref avec l'état
	useEffect(() => {
		currentRoomIdRef.current = gameState.currentRoomId;
	}, [gameState.currentRoomId]);

	const joinRoom = useCallback(
		(roomId: string) => {
			if (!socket || !isConnected || !roomId) return;

			if (currentRoomIdRef.current === roomId) {
				// S'assurer que loading est à false si on est déjà dans la room et que le jeu est chargé
				if (gameState.loading && gameState.currentRoomId === roomId) {
					setLoading(false);
				}
				return;
			}

			// Nouvelle room, joindre et mettre loading à true
			setLoading(true);
			useGameStore.setState((state) => ({
				gameState: {
					...state.gameState,
					currentRoomId: roomId,
				},
			}));

			// En cas de succès, loading passera à false à la réception de l'événement "sync"
			socket.emit("join", roomId, (response: JoinAck) => {
				if (!response.success || !response.roomId || response.playerId === undefined) {
					setLoading(false);
					console.error(`Failed to join room ${roomId}:`, response.error);
				}
			});
		},
		[socket, isConnected, gameState.loading, gameState.currentRoomId, setLoading]
	);

	const playMove = useCallback(
		(x: number) => {
			if (!socket || !isConnected) {
				return;
			}

			if (gameState.isWin || gameState.isDraw) {
				return;
			}

			if (!playerId) {
				return;
			}

			if (playerId !== gameState.currentPlayer) {
				return;
			}

			// Vérifier si la colonne est pleine
			const topCell = getCell(gameState.board, x, BOARD_ROWS - 1);
			if (topCell !== "empty") {
				return;
			}

			socket.emit("play", x);
		},
		[socket, isConnected, playerId, gameState]
	);

	const restart = useCallback(() => {
		if (socket && isConnected) {
			socket.emit("restart");
		}
		setWinDialogOpen(false);
	}, [socket, isConnected, setWinDialogOpen]);

	return {
		gameState,
		animatingTokens,
		winDialogOpen,
		winMessage,
		players,
		joinRoom,
		playMove,
		restart,
		setWinDialogOpen,
	};
};
