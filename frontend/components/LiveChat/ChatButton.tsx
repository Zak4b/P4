import React from "react";
import { Box, IconButton } from "@mui/material";
import { Chat as ChatIcon } from "@mui/icons-material";

interface ChatButtonProps {
	onClick: () => void;
}

export const ChatButton: React.FC<ChatButtonProps> = ({ onClick }) => {
	return (
		<Box
			sx={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				position: "relative",
			}}
		>
			<IconButton
				onClick={onClick}
				sx={{
					width: "100%",
					height: "100%",
					color: "white",
					"&:hover": {
						bgcolor: "primary.dark",
					},
				}}
			>
				<ChatIcon />
			</IconButton>
		</Box>
	);
};

