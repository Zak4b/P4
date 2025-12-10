import React from "react";
import { Box, Typography, Alert, Paper, Button, Stack } from "@mui/material";
import { Info as InfoIcon } from "@mui/icons-material";
import { Message } from "./types";
import { colors } from "@/lib/styles";

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
						<Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
							[{timeStr}]
						</Typography>
						{message.content}
					</Box>
				</Alert>
			);

		case "message":
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
							backgroundColor: isOwnMessage
								? colors.primary
								: undefined,
							background: isOwnMessage
								? undefined
								: colors.messageBg,
							color: isOwnMessage ? "white" : "text.primary",
							boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
						}}
					>
						<Typography variant="caption" sx={{ opacity: 0.9, display: "block", mb: 0.5 }}>
							{message.author} - {timeStr}
						</Typography>
						<Typography variant="body2">{message.content}</Typography>
					</Box>
				</Box>
			);

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
					<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
						[{timeStr}] {message.content}
					</Typography>
					<Stack direction="row" spacing={1}>
						<Button size="small" variant="contained" color="error" sx={{ flex: 1 }}>
							Non
						</Button>
						<Button size="small" variant="contained" color="success" sx={{ flex: 1 }}>
							Oui
						</Button>
					</Stack>
				</Paper>
			);

		default:
			return null;
	}
};

