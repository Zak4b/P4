"use client";

import { useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Button } from "@/components/ui";
import {
	PersonAdd as PersonAddIcon,
	People as PeopleIcon,
	HourglassEmpty as PendingIcon,
} from "@mui/icons-material";
import { buttonStyles } from "@/lib/styles";
import { useModalPortal } from "@/lib/hooks/useModalPortal";
import RemoveFriendConfirm from "@/components/RemoveFriendConfirm";

export type FriendStatus = "none" | "pending" | "friends";

const statusConfig = {
	none: {
		label: "Ajouter en amis",
		icon: PersonAddIcon,
		color: "primary.main",
		hoverBg: "tint.primary",
	},
	pending: {
		label: "En attente",
		icon: PendingIcon,
		color: "warning.main",
		hoverBg: "tint.warning",
	},
	friends: {
		label: "Amis",
		icon: PeopleIcon,
		color: "success.main",
		hoverBg: "tint.success",
	},
} as const;

interface FriendControlsProps {
	targetLogin: string;
	status: FriendStatus;
	isLoading?: boolean;
	onAddFriend: () => Promise<void>;
	onRemoveFriend: () => Promise<void>;
	onStatusChange?: (status: FriendStatus) => void;
}

export default function FriendControls({
	targetLogin,
	status,
	isLoading = false,
	onAddFriend,
	onRemoveFriend,
	onStatusChange,
}: FriendControlsProps) {
	const [isRemoving, setIsRemoving] = useState(false);

	const removeFriend = async (close: () => void) => {
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
	};

	const removeModal = useModalPortal({
		title: "Retirer l'ami",
		size: "sm",
		content: ({ close }) => (
			<RemoveFriendConfirm
				targetLogin={targetLogin}
				isRemoving={isRemoving}
				onCancel={close}
				onConfirm={() => {
					removeFriend(close).catch((err: unknown) => console.error(err));
				}}
			/>
		),
	});

	const addFriend = async () => {
		try {
			await onAddFriend();
			onStatusChange?.("pending");
		} catch {
			// Erreur gérée par l'appelant
		}
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

	const handleClick = () => {
		if (isAddClickable) {
			addFriend().catch((err: unknown) => console.error(err));
			return;
		}
		removeModal.open();
	};

	return (
		<>
			<Button
				variant="outline"
				disabled={!isClickable}
				startIcon={<IconComponent />}
				onClick={isClickable ? handleClick : undefined}
				sx={[
					buttonStyles.primaryOutlined,
					{
						borderColor: config.color,
						color: config.color,
						"&:hover": {
							borderColor: config.color,
							backgroundColor: isClickable ? config.hoverBg : "transparent",
						},
						"&.Mui-disabled": {
							borderColor: config.color,
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
