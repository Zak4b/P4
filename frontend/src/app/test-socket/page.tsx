"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Box, Button, TextField, Typography, Paper, List, ListItem, Chip } from "@mui/material";

interface Message {
	id: string;
	text: string;
	timestamp: Date;
	type: "sent" | "received";
}

export default function TestSocketPage() {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [socketId, setSocketId] = useState<string | null>(null);
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Initialiser Socket.IO
		// Utiliser l'URL de la fenêtre actuelle pour éviter les problèmes de CORS
		const socketUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
		
		const newSocket = io(socketUrl, {
			path: "/api/socket",
			transports: ["websocket", "polling"],
			autoConnect: true,
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
		});

		newSocket.on("connect", () => {
			console.log("🟢 Connecté au serveur Socket.IO");
			setIsConnected(true);
			setSocketId(newSocket.id || null);
		});

		newSocket.on("disconnect", (reason) => {
			console.log("🔴 Déconnecté du serveur Socket.IO:", reason);
			setIsConnected(false);
			setSocketId(null);
		});

		newSocket.on("connect_error", (error) => {
			console.error("❌ Erreur de connexion Socket.IO:", error.message);
			setIsConnected(false);
		});

		newSocket.on("message", (msg: string) => {
			console.log("Message reçu :", msg);
			setMessages((prev) => [
				...prev,
				{
					id: Date.now().toString(),
					text: msg,
					timestamp: new Date(),
					type: "received",
				},
			]);
		});

		setSocket(newSocket);

		return () => {
			newSocket.close();
		};
	}, []);

	// Auto-scroll vers le bas quand de nouveaux messages arrivent
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const sendMessage = () => {
		if (socket && message.trim() && isConnected) {
			socket.emit("message", message);
			setMessages((prev) => [
				...prev,
				{
					id: Date.now().toString(),
					text: message,
					timestamp: new Date(),
					type: "sent",
				},
			]);
			setMessage("");
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	return (
		<Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
			<Typography variant="h4" gutterBottom>
				Test Socket.IO
			</Typography>

			<Paper sx={{ p: 2, mb: 3 }}>
				<Typography variant="h6" gutterBottom>
					État de la connexion
				</Typography>
				<Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
					<Chip
						label={isConnected ? "Connecté" : "Déconnecté"}
						color={isConnected ? "success" : "error"}
						sx={{ fontWeight: "bold" }}
					/>
					{socketId && (
						<Typography variant="body2" color="text.secondary">
							Socket ID: {socketId}
						</Typography>
					)}
				</Box>
			</Paper>

			<Paper sx={{ p: 2, mb: 3, height: 400, display: "flex", flexDirection: "column" }}>
				<Typography variant="h6" gutterBottom>
					Messages
				</Typography>
				<List
					sx={{
						flex: 1,
						overflow: "auto",
						bgcolor: "background.paper",
						borderRadius: 1,
					}}
				>
					{messages.length === 0 ? (
						<ListItem>
							<Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
								Aucun message pour le moment. Envoyez un message pour commencer !
							</Typography>
						</ListItem>
					) : (
						messages.map((msg) => (
							<ListItem
								key={msg.id}
								sx={{
									display: "flex",
									justifyContent: msg.type === "sent" ? "flex-end" : "flex-start",
									py: 1,
								}}
							>
								<Paper
									sx={{
										p: 1.5,
										maxWidth: "70%",
										bgcolor: msg.type === "sent" ? "primary.main" : "grey.200",
										color: msg.type === "sent" ? "white" : "text.primary",
									}}
								>
									<Typography variant="body1">{msg.text}</Typography>
									<Typography
										variant="caption"
										sx={{
											display: "block",
											mt: 0.5,
											opacity: 0.7,
										}}
									>
										{msg.timestamp.toLocaleTimeString()}
									</Typography>
								</Paper>
							</ListItem>
						))
					)}
					<div ref={messagesEndRef} />
				</List>
			</Paper>

			<Paper sx={{ p: 2 }}>
				<Typography variant="h6" gutterBottom>
					Envoyer un message
				</Typography>
				<Box sx={{ display: "flex", gap: 2 }}>
					<TextField
						fullWidth
						label="Message"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyPress={handleKeyPress}
						disabled={!isConnected}
						placeholder={isConnected ? "Tapez votre message..." : "En attente de connexion..."}
					/>
					<Button
						variant="contained"
						onClick={sendMessage}
						disabled={!isConnected || !message.trim()}
						sx={{ minWidth: 120 }}
					>
						Envoyer
					</Button>
				</Box>
			</Paper>
		</Box>
	);
}