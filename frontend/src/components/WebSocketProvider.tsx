import React, { createContext, useContext, useEffect, useState, useRef, ReactNode, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { SyncEvent } from "@/lib/socketTypes";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3000";

interface WebSocketContextType {
	socket: Socket | null;
	isConnected: boolean;
	uuid: string | null;
	roomId: string | null;
	playerId: number | null;
	setRoomId: (roomId: string | null) => void;
	setPlayerId: (playerId: number | null) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
	const context = useContext(WebSocketContext);
	if (!context) {
		throw new Error("useWebSocket must be used within a WebSocketProvider");
	}
	return context;
};

interface WebSocketProviderProps {
	children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
	const { isAuthenticated, isAuthReady } = useAuth();
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [uuid, setUuid] = useState<string | null>(null);
	const [roomId, setRoomIdState] = useState<string | null>(null);
	const [playerId, setPlayerIdState] = useState<number | null>(null);
	const socketRef = useRef<Socket | null>(null);
	const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const reconnectAttempts = useRef(0);
	const MAX_RECONNECT_ATTEMPTS = 5;

	const setRoomId = useCallback((newRoomId: string | null) => {
		setRoomIdState(newRoomId);
	}, []);

	const setPlayerId = useCallback((newPlayerId: number | null) => {
		setPlayerIdState(newPlayerId);
	}, []);

	const connect = () => {
		// Ne pas se connecter si l'authentification n'est pas prête ou si l'utilisateur n'est pas authentifié
		if (!isAuthReady || !isAuthenticated || socketRef.current?.connected) {
			return;
		}

		try {
			// Socket.IO se connecte automatiquement
			const newSocket = io(WS_URL, {
				path: "/api/socket.io",
				transports: ["websocket", "polling"], // Permettre polling puis upgrade vers websocket
				reconnection: false, // On gère la reconnexion manuellement
				autoConnect: true,
				withCredentials: true, // Important pour envoyer les cookies
			});

			socketRef.current = newSocket;
			setSocket(newSocket);

			// Écouter l'événement registered pour obtenir l'UUID
			newSocket.on("registered", (data: string) => {
				setUuid(data);
			});

			// Écouter l'événement sync pour mettre à jour playerId
			newSocket.on("sync", (data: SyncEvent) => {
				if (data.playerId !== null) {
					setPlayerIdState(data.playerId);
				}
			});

			newSocket.on("connect", () => {
				setIsConnected(true);
				reconnectAttempts.current = 0;
			});

			newSocket.on("disconnect", (reason) => {
				setIsConnected(false);
				setSocket(null);
				setUuid(null);
				setRoomIdState(null);
				setPlayerIdState(null);

				if (!isAuthenticated) {
					setError("User not authenticated");
					return;
				}

				if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
					setError("Server is not responding");
					return;
				}
				reconnectAttempts.current++;
				const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000); // Backoff exponentiel, max 30s

				reconnectTimeoutRef.current = setTimeout(() => {
					connect();
				}, delay);
			});

			newSocket.on("connect_error", (error) => {
				setError("Error while connecting to the server: " + error.message);
				setIsConnected(false);
			});
		} catch {
			setError("Error")
			setIsConnected(false);
		}
	};

	const disconnect = () => {
		if (reconnectTimeoutRef.current) {
			clearTimeout(reconnectTimeoutRef.current);
			reconnectTimeoutRef.current = null;
		}

		if (socketRef.current) {
			socketRef.current.disconnect();
			socketRef.current = null;
		}

		setSocket(null);
		setIsConnected(false);
		setUuid(null);
		setRoomId(null);
		setPlayerId(null);
		reconnectAttempts.current = 0;
	};

	// Se connecter quand l'utilisateur est authentifié et que l'auth est prête
	useEffect(() => {
		// Attendre que l'authentification soit prête avant de se connecter
		if (!isAuthReady) {
			return;
		}

		if (isAuthenticated) {
			connect();
		} else {
			disconnect();
		}

		// Cleanup lors du démontage ou de la déconnexion
		return () => {
			disconnect();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated, isAuthReady]); // Dépendances nécessaires pour la connexion

	return (
		<WebSocketContext.Provider value={{ socket, isConnected, uuid, roomId, playerId, setRoomId, setPlayerId }}>
			{children}
		</WebSocketContext.Provider>
	);
};
