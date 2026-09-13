import React from "react";
import { Box, IconButton, Avatar } from "@mui/material";
import { Text, Muted } from "@/components/ui";
import { Close as CloseIcon } from "@mui/icons-material";
import type { Message } from "./types";

interface ChatHeaderProps {
	messages: Message[];
	onClose: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ messages, onClose }) => {
	return (
		<Box
			sx={{
				backgroundColor: "primary.main",
				color: "primary.contrastText",
				p: 1.5,
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
				<Avatar
					sx={{
						width: 32,
						height: 32,
						bgcolor: "rgba(255, 255, 255, 0.3)",
						color: "primary.contrastText",
						fontSize: "0.875rem",
					}}
				>
					💬
				</Avatar>
				<Box>
					<Text size="md" sx={{ fontWeight: 600 }}>
						Chat
					</Text>
					{messages.length > 0 && (
						<Muted variant="caption" sx={{ opacity: 0.8, color: "inherit" }}>
							{messages.filter((m) => m.type === "message").length} messages
						</Muted>
					)}
				</Box>
			</Box>
			<IconButton
				size="small"
				onClick={(e) => {
					e.stopPropagation();
					onClose();
				}}
				sx={{ color: "primary.contrastText" }}
			>
				<CloseIcon fontSize="small" />
			</IconButton>
		</Box>
	);
};
