"use client";

import { useParams } from "next/navigation";
import { Box, Typography, Paper, CircularProgress, Alert, Grid, Stack, Container } from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import { useUserQuery, useUserStatsQuery } from "@/lib/api/user/useUserQuery";
import { useFriendStatusQuery } from "@/lib/api/friend/useFriendQuery";
import { useRemoveFriendMutation, useSendFriendRequestMutation } from "@/lib/api/friend/useFriendMutation";
import { typographyStyles, paperStyles, avatarStyles, layoutStyles } from "@/lib/styles";
import UserAvatar from "@/components/UserAvatar";
import UserStatsPanel from "@/components/UserStatsPanel";
import FriendControls from "@/components/FriendControls";
import { useAuth } from "@/components/AuthContext";

export default function PublicProfilePage() {
	const params = useParams();
	const { user: currentUser } = useAuth();
	const id = (params?.id as string) ?? "";
	const isOwnProfile = Boolean(currentUser?.id === id);

	const userQuery = useUserQuery(id);
	const statsQuery = useUserStatsQuery(id);
	const friendStatusQuery = useFriendStatusQuery(isOwnProfile ? undefined : id);
	const sendFriendRequestMutation = useSendFriendRequestMutation();
	const removeFriendMutation = useRemoveFriendMutation();

	if (userQuery.isLoading || statsQuery.isLoading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
				<CircularProgress />
			</Box>
		);
	}

	if (!userQuery.data || !statsQuery.data) {
		return (
			<Container maxWidth="lg" sx={layoutStyles.container}>
				<Alert severity="error">Joueur introuvable</Alert>
			</Container>
		);
	}

	const profile = { ...userQuery.data, stats: statsQuery.data };
	const friendStatus = friendStatusQuery.data?.status ?? "none";

	return (
		<Container maxWidth="lg" sx={layoutStyles.container}>
			<Typography variant="h4" fontWeight={700} sx={typographyStyles.gradientTitle}>
				<PersonIcon />
				Profil de {profile.login}
			</Typography>

			<Grid container spacing={3} sx={{ mt: 2 }}>
				<Grid size={{ xs: 12, md: 6 }}>
					<Paper elevation={3} sx={[paperStyles.gradientPaper, { p: 3, height: "100%" }]}>
						<Stack spacing={3} alignItems="center">
							<UserAvatar
								userId={profile.id}
								login={profile.login}
								sx={{ ...avatarStyles.large, ...avatarStyles.gradientAvatar }}
							/>
							<Box sx={{ width: "100%" }}>
								<Stack spacing={2} alignItems="center">
									<Box sx={layoutStyles.flexCenter}>
										<PersonIcon color="primary" />
										<Typography variant="h6" fontWeight={600}>
											{profile.login}
										</Typography>
									</Box>
									{!isOwnProfile && currentUser && (
										<FriendControls
											targetLogin={profile.login}
											status={friendStatus}
											isLoading={friendStatusQuery.isFetching}
											onAddFriend={async () => {
												await sendFriendRequestMutation.mutateAsync(profile.id);
											}}
											onRemoveFriend={async () => {
												await removeFriendMutation.mutateAsync(profile.id);
											}}
										/>
									)}
								</Stack>
							</Box>
						</Stack>
					</Paper>
				</Grid>

				<Grid size={{ xs: 12, md: 6 }}>
					<UserStatsPanel profile={profile} />
				</Grid>
			</Grid>
		</Container>
	);
}
