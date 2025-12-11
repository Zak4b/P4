"use client";

import React, { useState } from "react";
import { Box, Paper } from "@mui/material";
import { useWebSocket } from "@/components/WebSocketProvider";
import { useChatMessages } from "./hooks/useChatMessages";
import { ChatButton } from "./ChatButton";
import { ChatHeader } from "./ChatHeader";
import { ChatContent } from "./ChatContent";
import { ChatInput } from "./ChatInput";
import { UnreadBadge } from "./UnreadBadge";

interface LiveChatProps {
	roomId?: string;
}

const LiveChat: React.FC<LiveChatProps> = ({ roomId = "1" }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [message, setMessage] = useState("");
	const { socket, isConnected, uuid } = useWebSocket();
	const { messages, dispatchMessages, messageAreaRef, unreadCount, setUnreadCount } = useChatMessages(roomId, isOpen);

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (!message.trim() || !socket || !isConnected || !uuid) return;

		const messageText = message.trim();
		
		socket.emit("message", messageText, (response: { success: boolean; message?: string }) => {
			if (response.success === false) {
				dispatchMessages({
					type: "add",
					payload: {
						id: `error-${Date.now()}`,
						type: "info",
						content: response.message || "Erreur lors de l'envoi du message",
						timestamp: new Date(),
					},
				});
			}
		});
		setMessage("");
	};

	const toggleChat = () => {
		if (!isOpen) {
			setUnreadCount(0);
		}
		setIsOpen(!isOpen);
	};

	return (
		<Box
			sx={{
				position: "fixed",
				bottom: 0,
				right: 16,
				zIndex: 1300,
				display: "flex",
				flexDirection: "column",
				alignItems: "flex-end",
			}}
		>
			<Box sx={{ position: "relative" }}>
				<Paper
					elevation={isOpen ? 8 : 4}
					onClick={!isOpen ? toggleChat : undefined}
					sx={{
						position: "relative",
						width: isOpen ? { xs: "calc(100vw - 32px)", sm: 380 } : 56,
						height: isOpen ? 500 : 56,
						bottom: isOpen ? 0 : 12,
						right: isOpen ? 0 : 0,
						display: "flex",
						flexDirection: "column",
						borderRadius: isOpen ? 2 : "50%",
						overflow: "hidden",
						bgcolor: isOpen ? "white" : "primary.main",
						color: isOpen ? "inherit" : "white",
						cursor: !isOpen ? "pointer" : "default",
						transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
						boxShadow: isOpen
							? "0 8px 24px rgba(0,0,0,0.15)"
							: "0 4px 12px rgba(0,0,0,0.15)",
					}}
				>
					{!isOpen && <ChatButton onClick={toggleChat} />}

					{isOpen && (
						<>
							<ChatHeader messages={messages} onClose={() => setIsOpen(false)} />
							<ChatContent messages={messages} currentUserId={uuid} messageAreaRef={messageAreaRef} />
							<ChatInput
								message={message}
								onMessageChange={setMessage}
								onSubmit={handleSendMessage}
							/>
						</>
					)}
				</Paper>
				{!isOpen && <UnreadBadge count={unreadCount} />}
			</Box>
		</Box>
	);
};

export default LiveChat;

