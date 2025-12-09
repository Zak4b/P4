import React from "react";
import { Box, IconButton, Typography, Avatar } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { Message } from "./types";
import { colors } from "@/lib/styles";

interface ChatHeaderProps {
	messages: Message[];
	onClose: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ messages, onClose }) => {
	return (
		<Box
			sx={{
				backgroundColor: colors.primary,
				color: "white",
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
						color: "white",
						fontSize: "0.875rem",
					}}
				>
					💬
				</Avatar>
				<Box>
					<Typography variant="body2" fontWeight={600}>
						Chat
					</Typography>
					{messages.length > 0 && (
						<Typography variant="caption" sx={{ opacity: 0.8 }}>
							{messages.filter((m) => m.type === "message").length} messages
						</Typography>
					)}
				</Box>
			</Box>
			<IconButton
				size="small"
				onClick={(e) => {
					e.stopPropagation();
					onClose();
				}}
				sx={{ color: "white" }}
			>
				<CloseIcon fontSize="small" />
			</IconButton>
		</Box>
	);
};

