import React, { useEffect, useReducer, useRef, useState } from "react";
import { useWebSocket } from "@/components/WebSocketProvider";
import { MessageEvent, InfoEvent, VoteEvent } from "@/lib/socketTypes";
import { Message } from "../types";
import { messageReducer } from "../messageReducer";

export const useChatMessages = (roomId: string, isOpen: boolean) => {
	const messageAreaRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
	const [messages, dispatchMessages] = useReducer(messageReducer, []);
	const [unreadCount, setUnreadCount] = useState(0);
	const { socket, isConnected, uuid } = useWebSocket();

	useEffect(() => {
		// Add initial welcome message
		const welcomeMessage: Message = {
			id: "welcome",
			type: "info",
			content: `Bienvenue dans la salle ${roomId}`,
			timestamp: new Date(),
		};
		dispatchMessages({ type: "reset", payload: [welcomeMessage] });
	}, [roomId]);

	useEffect(() => {
		if (!socket || !isConnected) return;

		const messageHandler = (data: MessageEvent) => {
			const isOwnMessage = data.clientId === uuid;
			
			const newMessage: Message = {
				id: `msg-${Date.now()}-${Math.random()}`,
				type: "message",
				content: data.message,
				author: isOwnMessage ? "Vous" : (data.displayName || `Joueur ${data.clientId.slice(0, 8)}`),
				authorId: data.clientId,
				timestamp: new Date(),
			};
			dispatchMessages({ type: "add", payload: newMessage });
			
			// Incrémenter le compteur de messages non lus si le chat est fermé et que ce n'est pas notre message
			if (!isOpen && !isOwnMessage) {
				setUnreadCount((prev) => prev + 1);
			}
		};

		const infoHandler = (data: string | InfoEvent) => {
			const content = typeof data === "string" ? data : data.data;
			const newMessage: Message = {
				id: `info-${Date.now()}-${Math.random()}`,
				type: "info",
				content,
				timestamp: new Date(),
			};
			dispatchMessages({ type: "add", payload: newMessage });
		};

		const voteHandler = (data: VoteEvent) => {
			const newMessage: Message = {
				id: `vote-${Date.now()}-${Math.random()}`,
				type: "vote",
				content: data.text,
				timestamp: new Date(),
			};
			dispatchMessages({ type: "add", payload: newMessage });
		};

		// Enregistrer les listeners
		socket.on("message", messageHandler);
		socket.on("info", infoHandler);
		socket.on("vote", voteHandler);

		return () => {
			// Nettoyer les listeners
			socket.off("message", messageHandler);
			socket.off("info", infoHandler);
			socket.off("vote", voteHandler);
		};
	}, [socket, isConnected, uuid, isOpen]);

	useEffect(() => {
		// Auto-scroll to bottom when new messages arrive
		if (messageAreaRef.current && isOpen) {
			messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
		}
	}, [messages, isOpen]);

	return {
		messages,
		dispatchMessages,
		messageAreaRef: messageAreaRef as React.RefObject<HTMLDivElement>,
		unreadCount,
		setUnreadCount,
	};
};

