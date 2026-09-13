"use client";

import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Button } from "@/components/ui";
import AvatarEditor from "@/components/AvatarEditor";

interface AvatarEditModalProps {
	open: boolean;
	onClose: () => void;
	seed: string;
}

export default function AvatarEditModal({ open, onClose, seed }: AvatarEditModalProps) {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="md"
			fullWidth
			slotProps={{ paper: { sx: { maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" } } }}
		>
			<DialogTitle sx={{ flexShrink: 0 }}>Personnaliser l&apos;avatar</DialogTitle>
			<DialogContent sx={{ overflow: "hidden", flex: 1, minHeight: 0, display: "flex", p: 0 }}>
				<AvatarEditor seed={seed} />
			</DialogContent>
			<DialogActions sx={{ flexShrink: 0 }}>
				<Button onClick={onClose}>
					Fermer
				</Button>
			</DialogActions>
		</Dialog>
	);
}
