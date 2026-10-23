"use client";

import { useState } from "react";
import { Stack } from "@mui/material";
import { Panel } from "@/components/ui";
import AvatarEditModal from "@/components/AvatarEditModal";
import { useAuth } from "@/components/AuthContext";
import { useUserQuery } from "@/lib/api/user/useUserQuery";
import { useFriendStatusQuery } from "@/lib/api/friend/useFriendQuery";
import { PanelLoading } from "@/components/profile/PanelLoading";
import { ProfileErrorState } from "./ProfileErrorState";
import { ProfileDetails } from "./ProfileDetails";
import { ProfileEmailActions } from "./ProfileEmailActions";
import { ProfileFriendActions } from "./ProfileFriendActions";

interface UserProfilePanelProps {
	userId: string;
}

export default function UserProfilePanel({ userId }: UserProfilePanelProps) {
	const { user: currentUser } = useAuth();
	const isOwnProfile = currentUser?.id === userId;
	const showFriendControls = Boolean(currentUser) && !isOwnProfile;
	const [avatarModalOpen, setAvatarModalOpen] = useState(false);

	// Sur son propre profil, `currentUser` (déjà en cache via /me) évite un fetch redondant.
	const userQuery = useUserQuery(userId, { enabled: !isOwnProfile });
	const friendStatusQuery = useFriendStatusQuery(showFriendControls ? userId : undefined);

	if (!isOwnProfile && userQuery.isLoading) {
		return <PanelLoading />;
	}

	if (!isOwnProfile && userQuery.isError) {
		return (
			<ProfileErrorState
				onRetry={() => {
					userQuery.refetch().catch(() => null);
				}}
			/>
		);
	}

	const username = isOwnProfile ? currentUser?.username : userQuery.data?.username;
	if (!username) {
		return null;
	}

	return (
        <>
            <Panel sx={{ p: 3, height: "100%" }}>
				<Stack spacing={3} sx={{
                    alignItems: "center"
                }}>
					{isOwnProfile && currentUser ? (
						<ProfileDetails
							userId={currentUser.id}
							username={currentUser.username}
							onEditAvatar={() => setAvatarModalOpen(true)}
							actions={<ProfileEmailActions userId={currentUser.id} email={currentUser.email} />}
						/>
					) : (
						<ProfileDetails
							userId={userId}
							username={username}
							actions={
								showFriendControls ? (
									<ProfileFriendActions
										userId={userId}
										username={username}
										status={friendStatusQuery.data?.status ?? "none"}
										isLoading={friendStatusQuery.isFetching}
									/>
								) : undefined
							}
						/>
					)}
				</Stack>
			</Panel>

            {isOwnProfile && currentUser && (
				<AvatarEditModal open={avatarModalOpen} onClose={() => setAvatarModalOpen(false)} seed={currentUser.id} />
			)}
        </>
    );
}
