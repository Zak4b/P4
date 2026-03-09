"use client";

import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	DialogProps,
	IconButton,
	Divider,
	Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

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
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	if (!mounted) {
		return null;
	}

	const maxWidth: DialogProps["maxWidth"] = size;

	return createPortal(
		<Dialog
			open={open}
			onClose={() => { if (closable) onClose(); }}
			disableEscapeKeyDown={!closable}
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
							color: (theme) => theme.palette.grey[500],
						}}
					>
						<CloseIcon />
					</IconButton>
				)}
			</DialogTitle>
			<Divider />
			<DialogContent
				dividers={scrollable}
				sx={scrollable ? { maxHeight: "70vh", overflow: "auto" } : {}}
			>
				{content}
			</DialogContent>
			{(onConfirm) ? (
				<>
					<Divider />
					<DialogActions>
						<Button onClick={onClose} disabled={isConfirming}>
							Annuler
						</Button>
						<Button onClick={handleConfirm} variant="contained" disabled={isConfirming}>
							{isConfirming ? "Validation..." : "Valider"}
						</Button>
					</DialogActions>
				</>
			) : null}
		</Dialog>,
		document.body
	);
}
