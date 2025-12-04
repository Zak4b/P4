import React, { useEffect, useRef, useState } from "react";
import {
	Box,
	Paper,
	TextField,
	Button,
	Typography,
	Stack,
	Alert,
	Chip,
} from "@mui/material";
import { Send as SendIcon, Info as InfoIcon } from "@mui/icons-material";

interface MessageAreaProps {
	roomId: string;
}

interface Message {
	id: string;
	type: "info" | "message" | "vote";
	content: string;
	author?: string;
	timestamp: Date;
}

const MessageArea: React.FC<MessageAreaProps> = ({ roomId }) => {
	const messageAreaRef = useRef<HTMLDivElement>(null);
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);

	useEffect(() => {
		// Add initial welcome message
		const welcomeMessage: Message = {
			id: "welcome",
			type: "info",
			content: `Bienvenue dans la salle ${roomId}`,
			timestamp: new Date(),
		};
		setMessages([welcomeMessage]);
	}, [roomId]);

	useEffect(() => {
		// Auto-scroll to bottom when new messages arrive
		if (messageAreaRef.current) {
			messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
		}
	}, [messages]);

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (!message.trim()) return;

		const newMessage: Message = {
			id: `msg-${Date.now()}`,
			type: "message",
			content: message,
			author: "Vous",
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, newMessage]);
		setMessage("");
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
				minHeight: "500px",
			}}
		>
			<Paper
				elevation={3}
				ref={messageAreaRef}
				sx={{
					flexGrow: 1,
					p: 2,
					mb: 2,
					borderRadius: 3,
					overflowY: "auto",
					background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
					maxHeight: "600px",
				}}
			>
				<Stack spacing={2}>
					{messages.map((msg) => (
						<MessageItem key={msg.id} message={msg} />
					))}
				</Stack>
			</Paper>

			<form onSubmit={handleSendMessage}>
				<Stack direction="row" spacing={1}>
					<TextField
						fullWidth
						placeholder="Tapez votre message..."
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						size="small"
						variant="outlined"
						sx={{
							"& .MuiOutlinedInput-root": {
								borderRadius: 2,
							},
						}}
					/>
					<Button
						type="submit"
						variant="contained"
						disabled={!message.trim()}
						startIcon={<SendIcon />}
						sx={{
							borderRadius: 2,
							background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
							"&:hover": {
								background: "linear-gradient(135deg, #4f46e5 0%, #db2777 100%)",
							},
						}}
					>
					Envoyer
					</Button>
				</Stack>
			</form>
		</Box>
	);
};

interface MessageItemProps {
	message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
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
			return (
				<Box
					sx={{
						display: "flex",
						justifyContent: "flex-end",
					}}
				>
					<Box
						sx={{
							maxWidth: "70%",
							p: 2,
							borderRadius: 3,
							background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
							color: "white",
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
						p: 2,
						borderRadius: 2,
						bgcolor: "background.paper",
					}}
				>
					<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
						[{timeStr}] {message.content}
					</Typography>
					<Stack direction="row" spacing={1}>
						<Button size="small" variant="contained" color="error">
							Non
						</Button>
						<Button size="small" variant="contained" color="success">
							Oui
						</Button>
					</Stack>
				</Paper>
			);

		default:
			return null;
	}
};

export default MessageArea;
