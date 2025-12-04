"use client";

import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	IconButton,
	Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface GameModalProps {
	show?: boolean;
	title?: string;
	message?: string;
	onClose?: () => void;
}

const GameModal: React.FC<GameModalProps> = ({ show = false, title = "", message = "", onClose }) => {
	const [isVisible, setIsVisible] = useState(show);
	const [modalTitle, setModalTitle] = useState(title);
	const [modalMessage, setModalMessage] = useState(message);

	useEffect(() => {
		setIsVisible(show);
	}, [show]);

	useEffect(() => {
		setModalTitle(title);
	}, [title]);

	useEffect(() => {
		setModalMessage(message);
	}, [message]);

	// Listen for global modal events (for compatibility with legacy code)
	useEffect(() => {
		const handleShowModal = (event: any) => {
			const { title, message } = event.detail || {};
			setModalTitle(title || "Information");
			setModalMessage(message || "");
			setIsVisible(true);
		};

		const handleHideModal = () => {
			setIsVisible(false);
		};

		// Custom events for legacy integration
		window.addEventListener("showGameModal", handleShowModal);
		window.addEventListener("hideGameModal", handleHideModal);

		return () => {
			window.removeEventListener("showGameModal", handleShowModal);
			window.removeEventListener("hideGameModal", handleHideModal);
		};
	}, []);

	const handleClose = () => {
		setIsVisible(false);
		if (onClose) {
			onClose();
		}
	};

	return (
		<Dialog
			open={isVisible}
			onClose={handleClose}
			maxWidth="sm"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 3,
					background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
				},
			}}
		>
			<DialogTitle
				sx={{
					background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
					color: "white",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<Typography variant="h6" fontWeight={700}>
					{modalTitle}
				</Typography>
				<IconButton
					onClick={handleClose}
					sx={{
						color: "white",
						"&:hover": {
							backgroundColor: "rgba(255, 255, 255, 0.2)",
						},
					}}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ pt: 3 }}>
				{modalMessage && (
					<Typography variant="body1" dangerouslySetInnerHTML={{ __html: modalMessage }} />
				)}
			</DialogContent>
			<DialogActions sx={{ p: 2 }}>
				<Button
					onClick={handleClose}
					variant="contained"
					sx={{
						background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
						"&:hover": {
							background: "linear-gradient(135deg, #4f46e5 0%, #db2777 100%)",
						},
					}}
				>
							Fermer
				</Button>
			</DialogActions>
		</Dialog>
	);
};

// Utility functions for showing modals from anywhere in the app
export const showModal = (title: string, message: string) => {
	const event = new CustomEvent("showGameModal", {
		detail: { title, message },
	});
	window.dispatchEvent(event);
};

export const hideModal = () => {
	const event = new CustomEvent("hideGameModal");
	window.dispatchEvent(event);
};

export default GameModal;
