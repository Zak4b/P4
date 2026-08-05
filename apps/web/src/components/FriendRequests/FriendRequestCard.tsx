"use client";

import { Stack, Button, CircularProgress, useTheme, useMediaQuery, IconButton } from "@mui/material";
import { PersonAdd as PersonAddIcon, PersonRemove as PersonRemoveIcon } from "@mui/icons-material";
import FriendElement from "../FriendElement";
import type { FriendRequest } from "./friendRequestsTypes";

interface FriendRequestCardProps {
	request: FriendRequest;
	loading: boolean;
	onAccept: (request: FriendRequest) => void;
	onReject: (request: FriendRequest) => void;
	onCloseParent?: () => void;
}

export default function FriendRequestCard({
	request,
	loading,
	onAccept,
	onReject,
	onCloseParent,
}: FriendRequestCardProps) {
	const theme = useTheme();
	const compact = useMediaQuery(theme.breakpoints.down("sm"));

	const slot = compact ? (
		<Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ flexShrink: 0 }}>
			<IconButton
				size="medium"
				color="success"
				disabled={loading}
				onClick={() => onAccept(request)}
				title="Accepter"
				sx={{ p: 1 }}
			>
				{loading ? (
					<CircularProgress size={24} color="inherit" />
				) : (
					<PersonAddIcon fontSize="medium" />
				)}
			</IconButton>
			<IconButton
				size="medium"
				color="error"
				disabled={loading}
				onClick={() => onReject(request)}
				title="Refuser"
				sx={{ p: 1 }}
			>
				<PersonRemoveIcon fontSize="medium" />
			</IconButton>
		</Stack>
	) : (
		<Stack direction="row" spacing={0.5} justifyContent="flex-end" sx={{ flexShrink: 0 }}>
			<Button
				size="small"
				variant="contained"
				color="success"
				disabled={loading}
				onClick={() => onAccept(request)}
				sx={{ minWidth: 0, px: 1.5 }}
				startIcon={
					loading ? (
						<CircularProgress size={16} color="inherit" />
					) : (
						<PersonAddIcon fontSize="small" />
					)
				}
			>
				Accepter
			</Button>
			<Button
				size="small"
				variant="outlined"
				color="error"
				disabled={loading}
				onClick={() => onReject(request)}
				sx={{ minWidth: 0, px: 1.5 }}
				startIcon={<PersonRemoveIcon fontSize="small" />}
			>
				Refuser
			</Button>
		</Stack>
	);

	return (
		<FriendElement
			user={request.fromUser}
			avatarSize={36}
			fullWidth
			onCloseParent={onCloseParent}
			slot={slot}
		/>
	);
}
