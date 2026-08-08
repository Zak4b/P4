"use client";

import FriendControls, { type FriendStatus } from "@/components/FriendControls";
import { useRemoveFriendMutation, useSendFriendRequestMutation } from "@/lib/api/friend/useFriendMutation";

interface ProfileFriendActionsProps {
	userId: string;
	login: string;
	status: FriendStatus;
	isLoading: boolean;
}

export function ProfileFriendActions({ userId, login, status, isLoading }: ProfileFriendActionsProps) {
	const sendFriendRequestMutation = useSendFriendRequestMutation();
	const removeFriendMutation = useRemoveFriendMutation();

	return (
		<FriendControls
			targetLogin={login}
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
