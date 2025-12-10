import { useCallback, useEffect, useRef } from "react";
import { useWebSocket } from "@/components/WebSocketProvider";
import { JoinResponse } from "@/lib/socketTypes";
import { useGameStore } from "../gameStore";
import { BOARD_ROWS } from "../constants";

export const useGame = () => {
	const { socket, isConnected, playerId } = useWebSocket();
	const gameState = useGameStore((state) => state.gameState);
	const animatingTokens = useGameStore((state) => state.animatingTokens);
	const winDialogOpen = useGameStore((state) => state.winDialogOpen);
	const winMessage = useGameStore((state) => state.winMessage);
	const initializeBoard = useGameStore((state) => state.initializeBoard);
	const handlePlay = useGameStore((state) => state.handlePlay);
	const handleSync = useGameStore((state) => state.handleSync);
	const handleDraw = useGameStore((state) => state.handleDraw);
	const handleRestart = useGameStore((state) => state.handleRestart);
	const setLoading = useGameStore((state) => state.setLoading);
	const setAnimatingTokens = useGameStore((state) => state.setAnimatingTokens);
	const setWinDialogOpen = useGameStore((state) => state.setWinDialogOpen);
	const setWinMessage = useGameStore((state) => state.setWinMessage);
	const handleWin = useGameStore((state) => state.handleWin);
	const currentRoomIdRef = useRef<string | null>(null);

	// Synchroniser la ref avec l'état
	useEffect(() => {
		currentRoomIdRef.current = gameState.currentRoomId;
	}, [gameState.currentRoomId]);

	const joinRoom = useCallback(
		(roomId: string) => {
			if (!socket || !isConnected || !roomId) return;

			if (currentRoomIdRef.current === roomId && roomId === currentRoomIdRef.current) {
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

			socket.emit("join", roomId, (response: JoinResponse) => {
				if (response.success && response.roomId && response.playerId !== undefined) {
					// Le loading sera mis à false lors de la réception de l'événement "sync"
					// roomId et playerId seront mis à jour via le contexte WebSocket dans useGameWebSocket
				} else {
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
			const topCell = gameState.board[x][BOARD_ROWS - 1];
			if (topCell !== "empty") {
				return;
			}

			socket.emit("play", x);
		},
		[socket, isConnected, playerId, gameState]
	);

	const restart = useCallback(
		(forced: boolean = false) => {
			if (socket && isConnected) {
				socket.emit("restart", { forced });
			}
			handleRestart();
			setWinDialogOpen(false);
		},
		[socket, isConnected, handleRestart, setWinDialogOpen]
	);

	return {
		gameState,
		animatingTokens,
		winDialogOpen,
		winMessage,
		initializeBoard,
		handlePlay,
		handleSync,
		handleWin,
		handleDraw,
		handleRestart,
		joinRoom,
		playMove,
		restart,
		setAnimatingTokens,
		setWinDialogOpen,
		setWinMessage,
	};
};

