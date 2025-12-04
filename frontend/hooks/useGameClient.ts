"use client";

import { useEffect, useRef } from "react";
import { useWebSocket } from "../components/WebSocketProvider";

export const useGameClient = (roomId: string) => {
	const { client, isConnected } = useWebSocket();
	const currentRoomIdRef = useRef<string | null>(null);

	useEffect(() => {
		// Rejoindre la salle quand le client est connecté ou quand on change de roomId
		if (client && isConnected) {
			if (currentRoomIdRef.current !== roomId) {
				client.join(roomId);
				currentRoomIdRef.current = roomId;
			}
		}

		// Réinitialiser le roomId si la connexion se ferme
		if (!isConnected) {
			currentRoomIdRef.current = null;
		}
	}, [client, isConnected, roomId]);

	return { client, isConnected };
};
