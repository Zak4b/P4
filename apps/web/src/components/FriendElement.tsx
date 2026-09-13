"use client";

import { Box, Paper, Stack } from "@mui/material";
import { Text, Muted } from "@/components/ui";
import UserAvatar from "./UserAvatar";
import UserActionsDropdown from "./UserActionsDropdown";

export interface FriendUser {
	id: string;
	login: string;
	eloRating: number;
}

interface FriendElementProps {
	user: FriendUser;
	avatarSize?: number;
	currentUserId?: string;
	showRemove?: boolean;
	fullWidth?: boolean;
	onCloseParent?: () => void;
	onRemove?: () => Promise<void>;
	onRemoveSuccess?: () => void;
	/** Contenu additionnel affiché à droite (ex: boutons Accepter/Refuser) */
	slot?: React.ReactNode;
	/** Effet hover sur la carte (bordure + fond) */
	hoverable?: boolean;
}

const UserInfo = ({ user, avatarSize }: { user: FriendUser; avatarSize: number }) => (
	<Box
		sx={{
			display: "flex",
			alignItems: "center",
			gap: 1.5,
			flex: 1,
			minWidth: 0,
		}}
	>
		<UserAvatar userId={user.id} login={user.login} size={avatarSize} />
		<Stack spacing={0} sx={{ minWidth: 0, flex: 1 }}>
			<Text
				size="md"
				noWrap
				sx={{
					fontWeight: 600,
					color: "text.primary",
				}}
			>
				{user.login}
			</Text>
			<Muted variant="caption">{user.eloRating} ELO</Muted>
		</Stack>
	</Box>
);

export default function FriendElement({
	user,
	avatarSize = 40,
	currentUserId,
	showRemove = false,
	fullWidth = false,
	onCloseParent,
	onRemove,
	onRemoveSuccess,
	slot,
	hoverable = false,
}: FriendElementProps) {
	const dropdownContent = <UserInfo user={user} avatarSize={avatarSize} />;

	const dropdown = (
		<UserActionsDropdown
			targetUser={{ id: user.id, login: user.login }}
			currentUserId={currentUserId}
			showRemove={showRemove}
			fullWidth={slot ? true : fullWidth}
			onCloseParent={onCloseParent}
			onRemove={onRemove}
			onRemoveSuccess={onRemoveSuccess}
		>
			{dropdownContent}
		</UserActionsDropdown>
	);

	const content = slot ? (
		<Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
			<Box sx={{ flex: 1, minWidth: 0 }}>{dropdown}</Box>
			{slot}
		</Box>
	) : (
		dropdown
	);

	return (
		<Paper
			elevation={0}
			sx={{
				width: "100%",
				p: 1.5,
				display: "flex",
				alignItems: "center",
				gap: 1.5,
				borderRadius: 2,
				border: "1px solid",
				borderColor: "divider",
				transition: "border-color 0.2s, background 0.2s",
				textAlign: "left",
				...(hoverable && {
					"&:hover": {
						borderColor: "primary.main",
						background: "rgba(99, 102, 241, 0.06)",
					},
				}),
			}}
		>
			{content}
		</Paper>
	);
}
