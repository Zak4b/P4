import React, { useEffect, useRef, useState } from "react";

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
		<div className="message-area-container d-flex flex-column h-100">
			{/* Message display area */}
			<div ref={messageAreaRef} className="msg-area d-flex flex-column flex-grow-1 w-100 py-2 px-1 border border-3 border-secondary rounded-4 lh-sm mb-2" style={{ minHeight: "400px" }}>
				<div className="msg-area-body flex-grow-1 overflow-y-scroll">
					{messages.map((msg) => (
						<MessageItem key={msg.id} message={msg} />
					))}
				</div>
			</div>

			{/* Message input */}
			<form onSubmit={handleSendMessage} className="d-flex">
				<input type="text" className="form-control me-2" placeholder="Tapez votre message..." value={message} onChange={(e) => setMessage(e.target.value)} />
				<button type="submit" className="btn btn-primary" disabled={!message.trim()}>
					Envoyer
				</button>
			</form>
		</div>
	);
};

interface MessageItemProps {
	message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
	const timeStr = message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

	switch (message.type) {
		case "info":
			return (
				<div className="message-box mb-2">
					<div className="message-content text-info">
						<small className="text-muted">[{timeStr}] </small>
						{message.content}
					</div>
				</div>
			);

		case "message":
			return (
				<div className="message-box mb-2">
					<div className="message-side">
						<div className="message-bubble bg-primary text-white p-2 rounded">
							<div className="message-header">
								<small className="text-light opacity-75">
									{message.author} - {timeStr}
								</small>
							</div>
							<div className="message-content">{message.content}</div>
						</div>
					</div>
				</div>
			);

		case "vote":
			return (
				<div className="message-box mb-2">
					<div className="message-content">
						<small className="text-muted">[{timeStr}] </small>
						{message.content}
					</div>
					<div className="vote-form mt-1">
						<button className="btn btn-sm btn-danger me-2">Non</button>
						<button className="btn btn-sm btn-success">Oui</button>
					</div>
				</div>
			);

		default:
			return null;
	}
};

export default MessageArea;
