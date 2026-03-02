"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext";
import {
	Box,
	Grid,
	Typography,
	CircularProgress,
	Alert,
	Paper,
	Stack,
} from "@mui/material";
import UserAvatar from "./UserAvatar";
import UserActionsDropdown from "./UserActionsDropdown";
import { apiClient } from "@/lib/api";
import { colors } from "@/lib/styles";

interface Friend {
	id: string;
	login: string;
	eloRating: number;
}

interface FriendListProps {
	onCloseModal?: () => void;
}

export default function FriendList({ onCloseModal }: FriendListProps) {
	const { user } = useAuth();
	const [friends, setFriends] = useState<Friend[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const loadFriends = async () => {
			setIsLoading(true);
			setError("");
			try {
				const data = await apiClient.getFriends();
				setFriends(data);
			} catch {
				setError("Impossible de charger la liste d'amis");
			} finally {
				setIsLoading(false);
			}
		};

		loadFriends();
	}, []);

	if (isLoading) {
		return (
			<Box display="flex" justifyContent="center" py={4}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Alert severity="error" sx={{ mt: 1 }}>
				{error}
			</Alert>
		);
	}

	if (friends.length === 0) {
		return (
			<Typography color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
				Aucun ami pour le moment
			</Typography>
		);
	}

	return (
		<Grid container spacing={1.5} sx={{ py: 1 }}>
			{friends.map((friend) => (
				<Grid size={{ xs: 6 }} key={friend.id}>
					<UserActionsDropdown
						targetUser={{ id: friend.id, login: friend.login }}
						currentUserId={user?.id}
						showRemove
						onCloseParent={onCloseModal}
						onRemove={async () => {
							await apiClient.removeFriendRequest(friend.login);
						}}
						onRemoveSuccess={() =>
							setFriends((prev) => prev.filter((f) => f.id !== friend.id))
						}
					>
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
								"&:hover": {
									borderColor: colors.primary,
									background: "rgba(99, 102, 241, 0.06)",
								},
							}}
						>
							<UserAvatar login={friend.login} size={40} />
							<Stack spacing={0} sx={{ minWidth: 0, flex: 1 }}>
								<Typography
									variant="body2"
									fontWeight={600}
									noWrap
									sx={{ color: "text.primary" }}
								>
									{friend.login}
								</Typography>
								<Typography variant="caption" color="text.secondary">
									{friend.eloRating} ELO
								</Typography>
							</Stack>
						</Paper>
					</UserActionsDropdown>
				</Grid>
			))}
		</Grid>
	);
}
