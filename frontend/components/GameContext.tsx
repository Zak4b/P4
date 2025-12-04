import { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from "react";
import { useWebSocket } from "./WebSocketProvider";

type TokenColor = "empty" | "player1" | "player2";
type Board = TokenColor[][];

interface GameState {
	board: Board;
	currentPlayer: number;
	lastMove: { x: number; y: number } | null;
	winningPlayer: number | null;
	isFull: boolean;
	isWin: boolean;
	loading: boolean;
	currentRoomId: string | null;
}

interface GameContextType {
	gameState: GameState;
	setActivePlayer?: (playerNumber: number, active: boolean) => void;
	initializeBoard: () => void;
	handlePlay: (e: CustomEvent<{ playerId: number; x: number; y: number; nextPlayerId: number }>) => void;
	handleSync: (e: CustomEvent<{ board?: number[][]; cPlayer: number; last?: { x: number; y: number } }>) => void;
	handleWin: (e: CustomEvent<{ uuid: string; playerid: number }>) => void;
	handleFull: () => void;
	handleRestart: () => void;
	joinRoom: (roomId: string) => void;
	animatingTokens: Set<string>;
	setAnimatingTokens: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const BOARD_COLS = 7;
const BOARD_ROWS = 6;

const GameContext = createContext<GameContextType | undefined>(undefined);

const getPlayerColor = (playerId: number): TokenColor => {
	return playerId === 1 ? "player1" : "player2";
};

const createEmptyBoard = (): Board => {
	return Array(BOARD_COLS)
		.fill(null)
		.map(() => Array(BOARD_ROWS).fill("empty" as TokenColor));
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
	const { client, isConnected } = useWebSocket();
	const [gameState, setGameState] = useState<GameState>({
		board: createEmptyBoard(),
		currentPlayer: 1,
		lastMove: null,
		winningPlayer: null,
		isFull: false,
		isWin: false,
		loading: false, // Commencer à false, sera mis à true seulement lors d'une nouvelle connexion
		currentRoomId: null,
	});

	const [animatingTokens, setAnimatingTokens] = useState<Set<string>>(new Set());
	const currentRoomIdRef = useRef<string | null>(null);

	// Synchroniser la ref avec l'état
	useEffect(() => {
		currentRoomIdRef.current = gameState.currentRoomId;
	}, [gameState.currentRoomId]);

	const initializeBoard = useCallback(() => {
		setGameState((prev) => ({
			...prev,
			board: createEmptyBoard(),
			lastMove: null,
			winningPlayer: null,
			isFull: false,
			isWin: false,
		}));
		setAnimatingTokens(new Set());
	}, []);

	const handlePlay = useCallback((e: CustomEvent<{ playerId: number; x: number; y: number; nextPlayerId: number }>) => {
		const { playerId, x, y, nextPlayerId } = e.detail;

		// Mettre à jour le board immédiatement avec le nouveau jeton
		setGameState((prev) => {
			const newBoard = prev.board.map((col) => [...col]);
			newBoard[x][y] = getPlayerColor(playerId);
			return {
				...prev,
				board: newBoard,
				currentPlayer: nextPlayerId,
				lastMove: { x, y },
			};
		});

		// Marquer ce jeton pour l'animation
		const tokenKey = `${x}-${y}`;
		setAnimatingTokens((prev) => new Set(prev).add(tokenKey));

		// Retirer l'animation après sa durée
		setTimeout(() => {
			setAnimatingTokens((prev) => {
				const next = new Set(prev);
				next.delete(tokenKey);
				return next;
			});
		}, 400);
	}, []);

	const handleSync = useCallback((e: CustomEvent<{ board?: number[][]; cPlayer: number; last?: { x: number; y: number } }>) => {
		setGameState((prev) => ({
			...prev,
			loading: false,
		}));

		const { board, cPlayer, last } = e.detail;

		if (board) {
			const newBoard: Board = createEmptyBoard();

			for (let x = 0; x < board.length; x++) {
				for (let y = 0; y < board[x].length; y++) {
					const playerId = board[x][y];
					if (playerId) {
						newBoard[x][y] = getPlayerColor(playerId);
					}
				}
			}

			setGameState((prev) => ({
				...prev,
				board: newBoard,
				currentPlayer: cPlayer,
				lastMove: last || null,
				loading: false,
			}));
		} else {
			setGameState((prev) => ({
				...prev,
				currentPlayer: cPlayer,
				loading: false,
			}));
		}
	}, []);

	const handleWin = useCallback(
		(e: CustomEvent<{ uuid: string; playerid: number }>) => {
			if (!client) return;
			setGameState((prev) => ({
				...prev,
				winningPlayer: e.detail.playerid,
				isWin: true,
			}));
		},
		[client]
	);

	const handleFull = useCallback(() => {
		setGameState((prev) => ({
			...prev,
			isFull: true,
		}));
	}, []);

	const handleRestart = useCallback(() => {
		initializeBoard();
	}, [initializeBoard]);

	const handleJoin = useCallback((e: CustomEvent<{ roomId: string; playerId: number }>) => {
		setGameState((prev) => ({
			...prev,
			loading: false,
			currentRoomId: e.detail.roomId,
		}));
	}, []);

	const joinRoom = useCallback(
		(roomId: string) => {
			if (!client || !isConnected || !roomId) return;

			// Si on est déjà dans cette room et connecté, ne rien faire
			if (currentRoomIdRef.current === roomId && client.roomId === roomId) {
				return;
			}

			// Nouvelle room, joindre et mettre loading à true
			client.join(roomId);
			setGameState((prev) => ({
				...prev,
				loading: true,
				currentRoomId: roomId,
			}));
		},
		[client, isConnected]
	);

	// Écouter les événements WebSocket
	useEffect(() => {
		if (!client || !isConnected) return;

		const eventTypes = ["join", "play", "sync", "win", "full", "restart"];

		const messageHandler = (event: Event) => {
			const eventType = event.type;
			const customEvent = event as CustomEvent;

			switch (eventType) {
				case "join":
					handleJoin(customEvent as CustomEvent<{ roomId: string; playerId: number }>);
					break;
				case "play":
					handlePlay(customEvent as CustomEvent<{ playerId: number; x: number; y: number; nextPlayerId: number }>);
					break;
				case "sync":
					handleSync(customEvent as CustomEvent<{ board?: number[][]; cPlayer: number; last?: { x: number; y: number } }>);
					break;
				case "win":
					handleWin(customEvent as CustomEvent<{ uuid: string; playerid: number }>);
					break;
				case "full":
					handleFull();
					break;
				case "restart":
					handleRestart();
					break;
			}
		};

		eventTypes.forEach((eventType) => {
			client.addEventListener(eventType, messageHandler as EventListener);
		});

		return () => {
			eventTypes.forEach((eventType) => {
				client.removeEventListener(eventType, messageHandler as EventListener);
			});
		};
	}, [client, isConnected, handleJoin, handlePlay, handleSync, handleWin, handleFull, handleRestart]);

	return (
		<GameContext.Provider
			value={{
				gameState,
				initializeBoard,
				handlePlay,
				handleSync,
				handleWin,
				handleFull,
				handleRestart,
				joinRoom,
				animatingTokens,
				setAnimatingTokens,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

export const useGame = () => {
	const ctx = useContext(GameContext);
	if (!ctx) throw new Error("useGame must be used inside GameProvider");
	return ctx;
};
