"use client";

import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	type DialogProps,
	IconButton,
	Divider,
	Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createPortal } from "react-dom";
import { useState, useSyncExternalStore } from "react";

const subscribe = () => () => {
	// Le statut ne change jamais après l'hydratation : rien à désabonner.
};

/** `false` pendant le rendu serveur, `true` une fois hydraté côté client. */
function useIsClient(): boolean {
	return useSyncExternalStore(
		subscribe,
		() => true,
		() => false
	);
}

export interface ModalProps {
	open: boolean;
	onClose: () => void;
	title?: string;
	content: React.ReactNode;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	scrollable?: boolean;
	onConfirm?: () => void | Promise<void>;
	closable?: boolean;
}

export default function Modal({
	open,
	onClose,
	title,
	content,
	size = "md",
	scrollable = false,
	onConfirm,
	closable = true,
}: ModalProps) {
	const [isConfirming, setIsConfirming] = useState(false);

	const handleConfirm = async () => {
		if (onConfirm) {
			setIsConfirming(true);
			try {
				await onConfirm();
			} finally {
				setIsConfirming(false);
			}
		}
	};
	const mounted = useIsClient();

	if (!mounted) {
		return null;
	}

	const maxWidth: DialogProps["maxWidth"] = size;

	return createPortal(
		<Dialog
			open={open}
			onClose={() => {
				if (closable) {
					onClose();
				}
			}}
			maxWidth={maxWidth}
			fullWidth
			scroll={scrollable ? "paper" : "body"}
		>
			<DialogTitle>
				{title}
				{closable && (
					<IconButton
						aria-label="close"
						onClick={onClose}
						sx={{
							position: "absolute",
							right: 8,
							top: 8,
							color: "text.secondary",
						}}
					>
						<CloseIcon />
					</IconButton>
				)}
			</DialogTitle>
			<Divider />
			<DialogContent dividers={scrollable} sx={scrollable ? { maxHeight: "70vh", overflow: "auto" } : {}}>
				{content}
			</DialogContent>
			{onConfirm ? (
				<>
					<Divider />
					<DialogActions>
						<Button onClick={onClose} disabled={isConfirming}>
							Annuler
						</Button>
						<Button
							onClick={() => {
								handleConfirm().catch((err: unknown) => console.error(err));
							}}
							variant="contained"
							disabled={isConfirming}
						>
							{isConfirming ? "Validation..." : "Valider"}
						</Button>
					</DialogActions>
				</>
			) : null}
		</Dialog>,
		document.body,
	);
}
