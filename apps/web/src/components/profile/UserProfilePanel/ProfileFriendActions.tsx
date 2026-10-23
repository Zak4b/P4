"use client";

import FriendControls, { type FriendStatus } from "@/components/FriendControls";
import { useRemoveFriendMutation, useSendFriendRequestMutation } from "@/lib/api/friend/useFriendMutation";

interface ProfileFriendActionsProps {
	userId: string;
	username: string;
	status: FriendStatus;
	isLoading: boolean;
}

export function ProfileFriendActions({ userId, username, status, isLoading }: ProfileFriendActionsProps) {
	const sendFriendRequestMutation = useSendFriendRequestMutation();
	const removeFriendMutation = useRemoveFriendMutation();

	return (
		<FriendControls
			targetUsername={username}
			status={status}
			isLoading={isLoading}
			onAddFriend={async () => {
				await sendFriendRequestMutation.mutateAsync(userId);
			}}
			onRemoveFriend={async () => {
				await removeFriendMutation.mutateAsync(userId);
			}}
		/>
	);
}
