"use client";

import { Alert, Box, CircularProgress, Container, Grid, Typography } from "@mui/material";
import { useAuth } from "@/components/AuthContext";
import { useUserQuery } from "@/lib/api/user/useUserQuery";
import { layoutStyles, typographyStyles } from "@/lib/styles";
import UserProfilePanel from "@/components/profile/UserProfilePanel";
import UserStatsPanel from "@/components/profile/UserStatsPanel";

interface ProfilePageProps {
	/** Missing = own profile */
	userId?: string;
}

export default function ProfilePage({ userId }: ProfilePageProps) {
	const { user: currentUser, isAuthReady } = useAuth();
	const isOwn = !userId || currentUser?.id === userId;

	const userQuery = useUserQuery(userId ?? "", { enabled: !isOwn });

	if (isOwn) {
		if (!isAuthReady) {
			return (
				<Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
					<CircularProgress />
				</Box>
			);
		}
		if (!currentUser) {
			return <Alert severity="warning">User information not available</Alert>;
		}
	}

	if (userQuery.isLoading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
				<CircularProgress />
			</Box>
		);
	}

	if (userQuery.isError || !userQuery.data) {
		return (
			<Container maxWidth="lg" sx={layoutStyles.container}>
				<Alert severity="error">Joueur introuvable</Alert>
			</Container>
		);
	}
	const resolvedUserId = isOwn ? currentUser?.id : userQuery.data?.id;
	const login = isOwn ? currentUser?.login : userQuery.data?.login;
	if (!resolvedUserId || !login) {
		return null;
	}

	return (
		<Container maxWidth="lg" sx={layoutStyles.container}>
			<Typography variant="h4" fontWeight={700} sx={typographyStyles.gradientTitle}>
				{isOwn ? "Mon compte" : `Profil de ${login}`}
			</Typography>

			<Grid container spacing={3}>
				<Grid size={{ xs: 12, md: 6 }}>
					<UserProfilePanel userId={resolvedUserId} />
				</Grid>

				<Grid size={{ xs: 12, md: 6 }}>
					<UserStatsPanel userId={resolvedUserId} />
				</Grid>
			</Grid>
		</Container>
	);
}
