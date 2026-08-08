"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Box, Typography, Paper, CircularProgress, Alert, Grid, Stack, Container } from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import { apiClient } from "@/lib/api";
import type { UserProfile } from "@p4/schemas/user";
import { typographyStyles, paperStyles, avatarStyles, layoutStyles } from "@/lib/styles";
import UserAvatar from "@/components/UserAvatar";
import UserStatsPanel from "@/components/UserStatsPanel";
import FriendControls, { type FriendStatus } from "@/components/FriendControls";
import { useAuth } from "@/components/AuthContext";

export default function PublicProfilePage() {
	const params = useParams();
	const { user: currentUser } = useAuth();
	const id = (params?.id as string) ?? "";
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [friendStatus, setFriendStatus] = useState<FriendStatus>("none");
	const [friendStatusLoading, setFriendStatusLoading] = useState(false);

	useEffect(() => {
		if (!id) {
			setIsLoading(false);
			setError("Joueur introuvable");
			return;
		}

		const loadData = async () => {
			setIsLoading(true);
			setError("");
			try {
				setProfile(await apiClient.getProfile(id));
			} catch {
				setError("Joueur introuvable");
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, [id]);

	useEffect(() => {
		if (!profile || !currentUser || profile.id === currentUser.id) {
			return;
		}

		const loadFriendStatus = async () => {
			setFriendStatusLoading(true);
			try {
				const { status } = await apiClient.getFriendStatus(profile.id);
				setFriendStatus(status);
			} catch {
				setFriendStatus("none");
			} finally {
				setFriendStatusLoading(false);
			}
		};

		loadFriendStatus();
	}, [profile, currentUser]);

	const isOwnProfile = currentUser && profile && profile.id === currentUser.id;

	if (isLoading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
				<CircularProgress />
			</Box>
		);
	}

	if (error || !profile) {
		return (
			<Container maxWidth="lg" sx={layoutStyles.container}>
				<Alert severity="error">{error || "Joueur introuvable"}</Alert>
			</Container>
		);
	}

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
							<UserAvatar login={profile.login} sx={{ ...avatarStyles.large, ...avatarStyles.gradientAvatar }} />
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
											isLoading={friendStatusLoading}
											onAddFriend={async () => {
												await apiClient.sendFriendRequest(profile.id);
											}}
											onRemoveFriend={async () => {
												await apiClient.removeFriend(profile.id);
											}}
											onStatusChange={setFriendStatus}
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
