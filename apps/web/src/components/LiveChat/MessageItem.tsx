import React from "react";
import { Box, Alert, Paper, Stack } from "@mui/material";
import { Text, Muted, Button } from "@/components/ui";
import { Info as InfoIcon } from "@mui/icons-material";
import type { Message } from "./types";

interface MessageItemProps {
	message: Message;
	currentUserId: string | null;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, currentUserId }) => {
	const timeStr = message.timestamp.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});

	switch (message.type) {
		case "info":
			return (
				<Alert
					severity="info"
					icon={<InfoIcon />}
					sx={{
						borderRadius: 2,
						py: 0.5,
					}}
				>
					<Box>
						<Muted variant="caption" sx={{ mr: 1 }}>
							[{timeStr}]
						</Muted>
						{message.content}
					</Box>
				</Alert>
			);

		case "message": {
			const isOwnMessage = message.authorId === currentUserId;
			return (
				<Box
					sx={{
						display: "flex",
						justifyContent: isOwnMessage ? "flex-end" : "flex-start",
					}}
				>
					<Box
						sx={{
							maxWidth: "75%",
							p: 1.5,
							borderRadius: 3,
							backgroundColor: isOwnMessage ? "primary.main" : "action.hover",
							color: isOwnMessage ? "primary.contrastText" : "text.primary",
							boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
						}}
					>
						<Text variant="caption" sx={{ opacity: 0.9, display: "block", mb: 0.5 }}>
							{message.author} - {timeStr}
						</Text>
						<Text size="md">{message.content}</Text>
					</Box>
				</Box>
			);
		}

		case "vote":
			return (
				<Paper
					elevation={1}
					sx={{
						p: 1.5,
						borderRadius: 2,
						bgcolor: "background.paper",
					}}
				>
					<Muted sx={{ mb: 1 }}>
						[{timeStr}] {message.content}
					</Muted>
					<Stack direction="row" spacing={1}>
						<Button size="sm" variant="destructive" sx={{ flex: 1 }}>
							Non
						</Button>
						<Button size="sm" variant="success" sx={{ flex: 1 }}>
							Oui
						</Button>
					</Stack>
				</Paper>
			);

		default:
			return null;
	}
};
