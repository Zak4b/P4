"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { Box, Grid, Typography, CircularProgress, Alert, Stack } from "@mui/material";
import FriendElement from "./FriendElement";
import { FriendRequestsDrawer, type FriendRequest } from "./FriendRequests";
import { apiClient } from "@/lib/api";

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
	const [requests, setRequests] = useState<FriendRequest[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	const loadData = async () => {
		setIsLoading(true);
		setError("");
		try {
			const [friendsData, requestsData] = await Promise.all([apiClient.getFriends(), apiClient.getFriendRequests()]);
			setFriends(friendsData);
			setRequests(requestsData);
		} catch {
			setError("Impossible de charger la liste");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadData();
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

	return (
		<Stack spacing={2} sx={{ py: 1 }}>
			<FriendRequestsDrawer
				requests={requests}
				onCloseModal={onCloseModal}
				onAccept={async (req) => {
					await apiClient.acceptFriendRequest(req.fromUser.login);
					setFriends((prev) => [...prev, req.fromUser]);
					setRequests((prev) => prev.filter((r) => r.id !== req.id));
				}}
				onReject={async (req) => {
					await apiClient.rejectFriendRequest(req.fromUser.login);
					setRequests((prev) => prev.filter((r) => r.id !== req.id));
				}}
			/>

			{friends.length === 0 ? (
				<Typography color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
					Aucun ami pour le moment
				</Typography>
			) : (
				<Grid container spacing={1.5}>
					{friends.map((friend) => (
						<Grid size={{ xs: 12, sm: 6 }} key={friend.id}>
							<FriendElement
								user={friend}
								currentUserId={user?.id}
								showRemove
								fullWidth
								hoverable
								onCloseParent={onCloseModal}
								onRemove={async () => {
									await apiClient.removeFriendRequest(friend.login);
								}}
								onRemoveSuccess={() => setFriends((prev) => prev.filter((f) => f.id !== friend.id))}
							/>
						</Grid>
					))}
				</Grid>
			)}
		</Stack>
	);
}
