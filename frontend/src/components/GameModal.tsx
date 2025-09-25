import React, { useState, useEffect } from "react";

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

	if (!isVisible) return null;

	return (
		<div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header">
						<h1 className="modal-title fs-5">{modalTitle}</h1>
						<button type="button" className="btn-close" onClick={handleClose} />
					</div>
					<div className="modal-body">{modalMessage && <div dangerouslySetInnerHTML={{ __html: modalMessage }} />}</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-primary" onClick={handleClose}>
							Fermer
						</button>
					</div>
				</div>
			</div>
		</div>
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
