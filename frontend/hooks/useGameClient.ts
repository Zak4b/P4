"use client";

import { useEffect, useRef } from "react";
import { useWebSocket } from "../components/WebSocketProvider";
import { useGame } from "@/store/useGameStore";

export const useGameClient = (roomId: string) => {
	const { socket, isConnected } = useWebSocket();
	const { joinRoom } = useGame();
	const currentRoomIdRef = useRef<string | null>(null);

	useEffect(() => {
		// Rejoindre la salle quand le socket est connecté ou quand on change de roomId
		if (socket && isConnected) {
			if (currentRoomIdRef.current !== roomId) {
				joinRoom(roomId);
				currentRoomIdRef.current = roomId;
			}
		}

		// Réinitialiser le roomId si la connexion se ferme
		if (!isConnected) {
			currentRoomIdRef.current = null;
		}
	}, [socket, isConnected, roomId, joinRoom]);

	return { socket, isConnected };
};
