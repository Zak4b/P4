import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { ClientP4 } from "@/lib/ClientP4";
import { useAuth } from "./AuthContext";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3000";

interface WebSocketContextType {
	client: ClientP4 | null;
	isConnected: boolean;
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
	const [client, setClient] = useState<ClientP4 | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const socketRef = useRef<Socket | null>(null);
	const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const reconnectAttempts = useRef(0);
	const MAX_RECONNECT_ATTEMPTS = 5;

	const connect = () => {
		// Ne pas se connecter si l'authentification n'est pas prête ou si l'utilisateur n'est pas authentifié
		if (!isAuthReady || !isAuthenticated || socketRef.current?.connected) {
			return;
		}

		try {
			// Socket.IO se connecte automatiquement
			const socket = io(WS_URL, {
				path: "/socket.io",
				transports: ["websocket", "polling"], // Permettre polling puis upgrade vers websocket
				reconnection: false, // On gère la reconnexion manuellement
				autoConnect: true,
				withCredentials: true, // Important pour envoyer les cookies
			});

			socketRef.current = socket;

			const gameClient = new ClientP4(socket);
			setClient(gameClient);

			socket.on("connect", () => {
				setIsConnected(true);
				reconnectAttempts.current = 0;
			});

			socket.on("disconnect", (reason) => {
				setIsConnected(false);
				setClient(null);

				// Tentative de reconnexion si l'utilisateur est toujours authentifié
				if (isAuthenticated && reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
					reconnectAttempts.current++;
					const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000); // Backoff exponentiel, max 30s

					reconnectTimeoutRef.current = setTimeout(() => {
						connect();
					}, delay);
				}
			});

			socket.on("connect_error", (error) => {
				console.error("Socket.IO connection error:", error);
				setIsConnected(false);
			});
		} catch (error) {
			console.error("Failed to create Socket.IO connection:", error);
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

		setClient(null);
		setIsConnected(false);
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

	return <WebSocketContext.Provider value={{ client, isConnected }}>{children}</WebSocketContext.Provider>;
};
