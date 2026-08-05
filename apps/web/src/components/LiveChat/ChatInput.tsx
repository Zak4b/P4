import React from "react";
import { Box, TextField, IconButton, Stack } from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";

interface ChatInputProps {
	message: string;
	onMessageChange: (value: string) => void;
	onSubmit: (e: React.FormEvent) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ message, onMessageChange, onSubmit }) => {
	return (
		<Box
			component="form"
			onSubmit={onSubmit}
			onClick={(e) => e.stopPropagation()}
			sx={{
				p: 1.5,
				borderTop: "1px solid",
				borderColor: "divider",
				background: "white",
			}}
		>
			<Stack direction="row" spacing={1}>
				<TextField
					fullWidth
					placeholder="Tapez votre message..."
					value={message}
					onChange={(e) => onMessageChange(e.target.value)}
					size="small"
					variant="outlined"
					autoFocus
					sx={{
						"& .MuiOutlinedInput-root": {
							borderRadius: 2,
							"& fieldset": {
								borderColor: "#e0e0e0",
							},
							"&:hover fieldset": {
								borderColor: "#6366f1",
							},
							"&.Mui-focused fieldset": {
								borderColor: "#6366f1",
							},
						},
					}}
				/>
				<IconButton
					type="submit"
					disabled={!message.trim()}
					sx={{
						bgcolor: "primary.main",
						color: "white",
						"&:hover": {
							bgcolor: "primary.dark",
						},
						"&.Mui-disabled": {
							bgcolor: "grey.300",
							color: "grey.500",
						},
					}}
				>
					<SendIcon />
				</IconButton>
			</Stack>
		</Box>
	);
};

