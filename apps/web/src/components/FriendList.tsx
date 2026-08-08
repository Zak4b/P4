"use client";

import { useAuth } from "@/components/AuthContext";
import { Box, Grid, Typography, CircularProgress, Alert, Stack } from "@mui/material";
import FriendElement from "./FriendElement";
import FriendRequestsDrawer from "./FriendRequests/FriendRequestsDrawer";
import { useFriendRequestsQuery, useFriendsQuery } from "@/lib/api/friend/useFriendQuery";
import {
	useAcceptFriendRequestMutation,
	useDeleteFriendRequestMutation,
	useRemoveFriendMutation,
} from "@/lib/api/friend/useFriendMutation";

interface FriendListProps {
	onCloseModal?: () => void;
}

export default function FriendList({ onCloseModal }: FriendListProps) {
	const { user } = useAuth();
	const friendsQuery = useFriendsQuery();
	const requestsQuery = useFriendRequestsQuery();
	const acceptMutation = useAcceptFriendRequestMutation();
	const deleteMutation = useDeleteFriendRequestMutation();
	const removeMutation = useRemoveFriendMutation();

	const isLoading = friendsQuery.isLoading || requestsQuery.isLoading;
	const isError = friendsQuery.isError || requestsQuery.isError;
	const friends = friendsQuery.data ?? [];
	const requests = requestsQuery.data ?? [];

	if (isLoading) {
		return (
			<Box display="flex" justifyContent="center" py={4}>
				<CircularProgress />
			</Box>
		);
	}

	if (isError) {
		return (
			<Alert severity="error" sx={{ mt: 1 }}>
				Impossible de charger la liste
			</Alert>
		);
	}

	return (
		<Stack spacing={2} sx={{ py: 1 }}>
			<FriendRequestsDrawer
				requests={requests}
				onCloseModal={onCloseModal}
				onAccept={async (req) => {
					await acceptMutation.mutateAsync(req.id);
				}}
				onReject={async (req) => {
					await deleteMutation.mutateAsync(req.id);
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
									await removeMutation.mutateAsync(friend.id);
								}}
							/>
						</Grid>
					))}
				</Grid>
			)}
		</Stack>
	);
}
