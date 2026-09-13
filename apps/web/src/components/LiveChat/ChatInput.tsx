import React from "react";
import { Box, IconButton, Stack } from "@mui/material";
import { Input } from "@/components/ui";
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
				backgroundColor: "background.paper",
			}}
		>
			<Stack direction="row" spacing={1}>
				<Input
					fullWidth
					placeholder="Tapez votre message..."
					value={message}
					onChange={(e) => onMessageChange(e.target.value)}
					size="small"
					autoFocus
					sx={{
						"& .MuiOutlinedInput-root": {
							borderRadius: 2,
							"& fieldset": {
								borderColor: "divider",
							},
							"&:hover fieldset": {
								borderColor: "primary.main",
							},
							"&.Mui-focused fieldset": {
								borderColor: "primary.main",
							},
						},
					}}
				/>
				<IconButton
					type="submit"
					disabled={!message.trim()}
					sx={{
						bgcolor: "primary.main",
						color: "primary.contrastText",
						"&:hover": {
							bgcolor: "primary.dark",
						},
						"&.Mui-disabled": {
							bgcolor: "action.disabledBackground",
							color: "action.disabled",
						},
					}}
				>
					<SendIcon />
				</IconButton>
			</Stack>
		</Box>
	);
};
