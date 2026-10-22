"use client";

import { Alert, Box, CircularProgress, Container, Grid } from "@mui/material";
import { PageHeader } from "@/components/ui";
import { useAuth } from "@/components/AuthContext";
import { useUserQuery } from "@/lib/api/user/useUserQuery";
import { layoutStyles } from "@/lib/styles";
import UserProfilePanel from "@/components/profile/UserProfilePanel";
import UserStatsPanel from "@/components/profile/UserStatsPanel";
import MatchHistoryPanel from "@/components/profile/MatchHistoryPanel";

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
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "400px"
                    }}>
                    <CircularProgress />
                </Box>
            );
		}
		if (!currentUser) {
			return <Alert severity="warning">Informations du joueur indisponibles</Alert>;
		}
	}

	if (!isOwn) {
		if (userQuery.isLoading) {
			return (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "400px"
                    }}>
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
	}
	const resolvedUserId = isOwn ? currentUser?.id : userQuery.data?.id;
	const login = isOwn ? currentUser?.login : userQuery.data?.login;
	if (!resolvedUserId || !login) {
		return null;
	}

	return (
        <Container maxWidth="lg" sx={layoutStyles.container}>
            <PageHeader title={isOwn ? "Mon compte" : `Profil de ${login}`} />

            <Grid container spacing={3} data-motion="" sx={{ animation: "riseIn 420ms var(--ease-out) 60ms both" }}>
				<Grid size={{ xs: 12, md: 6 }}>
					<UserProfilePanel userId={resolvedUserId} />
				</Grid>

				<Grid size={{ xs: 12, md: 6 }}>
					<UserStatsPanel userId={resolvedUserId} />
				</Grid>
			</Grid>

            <Box data-motion="" sx={{ mt: { xs: 4, md: 5 }, animation: "riseIn 420ms var(--ease-out) 120ms both" }}>
				<MatchHistoryPanel userId={resolvedUserId} />
			</Box>
        </Container>
    );
}
