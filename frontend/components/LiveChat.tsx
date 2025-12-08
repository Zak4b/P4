"use client";

import React, { useEffect, useRef, useState } from "react";
import {
	Box,
	Paper,
	TextField,
	IconButton,
	Button,
	Typography,
	Stack,
	Alert,
	Avatar,
} from "@mui/material";
import {
	Send as SendIcon,
	Info as InfoIcon,
	Close as CloseIcon,
	Chat as ChatIcon,
} from "@mui/icons-material";

interface LiveChatProps {
	roomId?: string;
}

interface Message {
	id: string;
	type: "info" | "message" | "vote";
	content: string;
	author?: string;
	authorId?: string;
	timestamp: Date;
}

const LiveChat: React.FC<LiveChatProps> = ({ roomId = "1" }) => {
	const messageAreaRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);
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
		if (messageAreaRef.current && isOpen) {
			messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
		}
	}, [messages, isOpen]);

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

	const toggleChat = () => {
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
				{/* Chat Button State */}
				{!isOpen && (
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
							onClick={toggleChat}
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
						{messages.filter((m) => m.type === "message").length > 0 && (
							<Box
								sx={{
									position: "absolute",
									top: -4,
									right: -4,
									minWidth: 20,
									height: 20,
									borderRadius: "50%",
									bgcolor: "error.main",
									color: "white",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: "0.75rem",
									fontWeight: 600,
									border: "2px solid white",
								}}
							>
								{messages.filter((m) => m.type === "message").length}
							</Box>
						)}
					</Box>
				)}

				{/* Chat Window State */}
				{isOpen && (
					<>
						{/* Chat Header */}
						<Box
						sx={{
							background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
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
									setIsOpen(false);
								}}
								sx={{ color: "white" }}
							>
								<CloseIcon fontSize="small" />
							</IconButton>
					</Box>

					{/* Chat Content */}
							<Box
								ref={messageAreaRef}
								sx={{
									flexGrow: 1,
									p: 2,
									overflowY: "auto",
									background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
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
										<MessageItem key={msg.id} message={msg} />
									))}
								</Stack>
							</Box>

							{/* Chat Input */}
							<Box
								component="form"
								onSubmit={handleSendMessage}
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
										onChange={(e) => setMessage(e.target.value)}
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
						</>
					)}
				</Paper>
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
			return (
				<Box
					sx={{
						display: "flex",
						justifyContent: "flex-end",
					}}
				>
					<Box
						sx={{
							maxWidth: "75%",
							p: 1.5,
							borderRadius: 3,
							background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
							color: "white",
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

export default LiveChat;

