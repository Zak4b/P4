import React from "react";
import { Box, Stack } from "@mui/material";
import { Message } from "./types";
import { MessageItem } from "./MessageItem";
import { colors } from "@/lib/styles";

interface ChatContentProps {
	messages: Message[];
	currentUserId: string | null;
	messageAreaRef: React.RefObject<HTMLDivElement>;
}

export const ChatContent: React.FC<ChatContentProps> = ({ messages, currentUserId, messageAreaRef }) => {
	return (
		<Box
			ref={messageAreaRef}
			sx={{
				flexGrow: 1,
				p: 2,
				overflowY: "auto",
				background: colors.backgroundLight,
				"&::-webkit-scrollbar": {
					width: "6px",
				},
				"&::-webkit-scrollbar-track": {
					background: "#f1f1f1",
				},
				"&::-webkit-scrollbar-thumb": {
					background: "#c1c1c1",
					borderRadius: "3px",
				},
				"&::-webkit-scrollbar-thumb:hover": {
					background: "#a8a8a8",
				},
			}}
		>
			<Stack spacing={1.5}>
				{messages.map((msg) => (
					<MessageItem key={msg.id} message={msg} currentUserId={currentUserId} />
				))}
			</Stack>
		</Box>
	);
};

