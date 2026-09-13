"use client";

import { useEffect } from "react";
import { useWebSocket } from "@/components/WebSocketProvider";
import { useModalPortal } from "@/lib/hooks/useModalPortal";
import MatchmakingModalContent from "@/components/Matchmaking/MatchmakingModalContent";

export function useMatching() {
	const { socket, isConnected } = useWebSocket();

	const matchmakingModal = useModalPortal({
		title: "Recherche d'adversaire",
		closable: false,
		size: "xs",
		content: ({ close }) => (
			<MatchmakingModalContent
				onCancel={() => {
					socket?.emit("game:p4:matchmaking:leave");
					close();
				}}
			/>
		),
	});

	const startMatchmaking = () => {
		if (!socket || !isConnected) {
			return;
		}
		socket.emit("game:p4:matchmaking:join");
		matchmakingModal.open();
	};

	useEffect(() => {
		return () => {
			if (matchmakingModal.isOpen && socket) {
				socket.emit("game:p4:matchmaking:leave");
			}
		};
	}, [matchmakingModal.isOpen, socket]);

	return {
		modal: matchmakingModal.modal,
		startMatchmaking,
		isConnected,
	};
}
