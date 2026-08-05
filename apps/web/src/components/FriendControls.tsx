"use client";

import { useState } from "react";
import { Button, Box, CircularProgress, Stack, Typography } from "@mui/material";
import {
	PersonAdd as PersonAddIcon,
	People as PeopleIcon,
	HourglassEmpty as PendingIcon,
	PersonRemove as PersonRemoveIcon,
} from "@mui/icons-material";
import { buttonStyles } from "@/lib/styles";
import { useModalPortal } from "@/lib/hooks/useModalPortal";

export type FriendStatus = "none" | "pending" | "friends";

const statusConfig = {
	none: {
		label: "Ajouter en amis",
		icon: PersonAddIcon,
		borderColor: "#6366f1",
		color: "#6366f1",
		hoverBg: "rgba(99, 102, 241, 0.1)",
	},
	pending: {
		label: "En attente",
		icon: PendingIcon,
		borderColor: "#f59e0b",
		color: "#f59e0b",
		hoverBg: "rgba(245, 158, 11, 0.1)",
	},
	friends: {
		label: "Amis",
		icon: PeopleIcon,
		borderColor: "#10b981",
		color: "#10b981",
		hoverBg: "rgba(16, 185, 129, 0.1)",
	},
} as const;

interface FriendControlsProps {
	targetIdentifier: string;
	targetLogin?: string;
	status: FriendStatus;
	isLoading?: boolean;
	onAddFriend: () => Promise<void>;
	onRemoveFriend: () => Promise<void>;
	onStatusChange?: (status: FriendStatus) => void;
}

export default function FriendControls({
	targetIdentifier,
	targetLogin,
	status,
	isLoading = false,
	onAddFriend,
	onRemoveFriend,
	onStatusChange,
}: FriendControlsProps) {
	const [isRemoving, setIsRemoving] = useState(false);

	const removeModal = useModalPortal({
		title: "Retirer l'ami",
		size: "sm",
		content: ({ close }) => (
			<Stack spacing={3}>
				<Typography color="text.secondary">
					Voulez-vous retirer {targetLogin || targetIdentifier} de votre liste d'amis ?
				</Typography>
				<Stack direction="row" spacing={2} justifyContent="flex-end">
					<Button variant="outlined" onClick={close} disabled={isRemoving}>
						Annuler
					</Button>
					<Button
						variant="contained"
						color="error"
						startIcon={<PersonRemoveIcon />}
						disabled={isRemoving}
						onClick={async () => {
							setIsRemoving(true);
							try {
								await onRemoveFriend();
								onStatusChange?.("none");
								close();
							} catch {
								// Erreur gérée par l'appelant
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

	const handleAddFriend = async () => {
		try {
			await onAddFriend();
			onStatusChange?.("pending");
		} catch {
			// Erreur gérée par l'appelant
		}
	};

	const handleFriendsClick = () => {
		if (status === "friends") removeModal.open();
	};

	if (isLoading) {
		return (
			<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
				<CircularProgress size={24} />
			</Box>
		);
	}

	const config = statusConfig[status];
	const IconComponent = config.icon;
	const isAddClickable = status === "none";
	const isFriendsClickable = status === "friends";
	const isClickable = isAddClickable || isFriendsClickable;

	return (
		<>
			<Button
				variant="outlined"
				disabled={!isClickable}
				startIcon={<IconComponent />}
				onClick={isAddClickable ? handleAddFriend : isFriendsClickable ? handleFriendsClick : undefined}
				sx={[
				buttonStyles.primaryOutlined,
				{
					borderColor: config.borderColor,
					color: config.color,
					"&:hover": {
						borderColor: config.borderColor,
						background: isClickable ? config.hoverBg : "transparent",
					},
					"&.Mui-disabled": {
						borderColor: config.borderColor,
						color: config.color,
						opacity: 1,
						cursor: "default",
					},
				},
			]}
		>
				{config.label}
			</Button>
			{removeModal.modal}
		</>
	);
}
