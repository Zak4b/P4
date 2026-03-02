"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Box,
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemText,
	Stack,
	Typography,
	Button,
} from "@mui/material";
import {
	Person as PersonIcon,
	SportsEsports as InviteIcon,
	PersonRemove as PersonRemoveIcon,
} from "@mui/icons-material";
import { apiClient } from "@/lib/api";
import { useModalPortal } from "@/lib/hooks/useModalPortal";

export interface TargetUser {
	id: string;
	login: string;
}

interface UserActionsDropdownProps {
	children: React.ReactNode;
	targetUser: TargetUser;
	/** Affiche le bouton Retirer (quand l'utilisateur est ami) */
	showRemove?: boolean;
	/** Appelé avant navigation (ex: fermer un modal parent) */
	onCloseParent?: () => void;
	/** Appelé pour retirer l'ami - requis si showRemove */
	onRemove?: () => Promise<void>;
	/** Appelé après suppression réussie (ex: mise à jour de la liste) */
	onRemoveSuccess?: () => void;
	anchorOrigin?: { horizontal: "left" | "right"; vertical: "top" | "bottom" };
	transformOrigin?: { horizontal: "left" | "right"; vertical: "top" | "bottom" };
}

export default function UserActionsDropdown({
	children,
	targetUser,
	showRemove = false,
	onCloseParent,
	onRemove,
	onRemoveSuccess,
	anchorOrigin = { horizontal: "left", vertical: "bottom" },
	transformOrigin = { horizontal: "left", vertical: "top" },
}: UserActionsDropdownProps) {
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [isInviting, setIsInviting] = useState(false);
	const [isRemoving, setIsRemoving] = useState(false);

	const removeModal = useModalPortal({
		title: "Retirer l'ami",
		size: "sm",
		content: ({ close }) => (
			<Stack spacing={3}>
				<Typography color="text.secondary">
					Voulez-vous retirer {targetUser.login} de votre liste d'amis ?
				</Typography>
				<Stack direction="row" spacing={2} justifyContent="flex-end">
					<Button variant="outlined" onClick={close} disabled={isRemoving}>
						Annuler
					</Button>
					<Button
						variant="contained"
						color="error"
						startIcon={<PersonRemoveIcon />}
						disabled={isRemoving || !onRemove}
						onClick={async () => {
							if (!onRemove) return;
							setIsRemoving(true);
							try {
								await onRemove();
								onRemoveSuccess?.();
								close();
								setAnchorEl(null);
							} catch {
								// Erreur gérée par le parent
							} finally {
								setIsRemoving(false);
							}
						}}
					>
						{isRemoving ? "Suppression..." : "Retirer l'ami"}
					</Button>
				</Stack>
			</Stack>
		),
	});

	const handleTriggerClick = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleViewProfile = () => {
		onCloseParent?.();
		router.push(`/profile/${encodeURIComponent(targetUser.login)}`);
		handleMenuClose();
	};

	const handleInvite = async () => {
		setIsInviting(true);
		try {
			const roomName =
				`Partie avec ${targetUser.login}`.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 20) ||
				`room_${Date.now()}`;
			const response = await apiClient.newRoom(roomName);
			if (response.success && response.roomId) {
				onCloseParent?.();
				router.push(`/play/${response.roomId}`);
			}
		} catch {
			// Erreur gérée
		} finally {
			setIsInviting(false);
			handleMenuClose();
		}
	};

	const handleRemoveClick = () => {
		setAnchorEl(null);
		removeModal.open();
	};

	return (
		<>
			<Box component="span" onClick={handleTriggerClick} sx={{ cursor: "pointer", display: "inline-block" }}>
				{children}
			</Box>
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleMenuClose}
				anchorOrigin={anchorOrigin}
				transformOrigin={transformOrigin}
			>
				<MenuItem onClick={handleViewProfile}>
					<ListItemIcon>
						<PersonIcon fontSize="small" />
					</ListItemIcon>
					<ListItemText>Voir le profil</ListItemText>
				</MenuItem>
				<MenuItem onClick={handleInvite} disabled={isInviting}>
					<ListItemIcon>
						<InviteIcon fontSize="small" />
					</ListItemIcon>
					<ListItemText>{isInviting ? "Création..." : "Inviter"}</ListItemText>
				</MenuItem>
				{showRemove && onRemove && (
					<MenuItem onClick={handleRemoveClick} sx={{ color: "error.main" }}>
						<ListItemIcon sx={{ color: "error.main" }}>
							<PersonRemoveIcon fontSize="small" />
						</ListItemIcon>
						<ListItemText>Retirer</ListItemText>
					</MenuItem>
				)}
			</Menu>
			{removeModal.modal}
		</>
	);
}
