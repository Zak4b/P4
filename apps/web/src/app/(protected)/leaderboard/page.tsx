"use client";

import { Box, Paper, CircularProgress, Alert, Stack, Container } from "@mui/material";
import { Heading } from "@/components/ui";
import { EmojiEvents as TrophyIcon } from "@mui/icons-material";
import { useLeaderboardQuery } from "@/lib/api/user/useUserQuery";
import { typographyStyles, paperStyles, layoutStyles } from "@/lib/styles";
import Podium from "./components/Podium";
import LeaderboardEntry from "./components/LeaderboardEntry";

export default function LeaderboardPage() {
	const leaderboardQuery = useLeaderboardQuery();
	const players = leaderboardQuery.data ?? [];

	if (leaderboardQuery.isLoading) {
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

	if (leaderboardQuery.isError) {
		return <Alert severity="error">Erreur lors du chargement du classement: {leaderboardQuery.error.message}</Alert>;
	}

	const topThree = players.slice(0, 3);
	const rest = players.slice(3);

	return (
        <Container maxWidth="lg" sx={layoutStyles.container}>
            <Box>
				<Heading
                    level={4}
                    sx={[{
                        fontWeight: 700
                    }, typographyStyles.gradientTitle]}>
					<TrophyIcon />
					Classement
				</Heading>

				<Podium topThree={topThree} />
				{rest.length > 0 && (
					<Paper elevation={3} sx={[paperStyles.gradientPaper, { p: 3 }]}>
						<Stack spacing={2}>
							{rest.map((player, index) => (
								<LeaderboardEntry key={player.id} player={player} rank={index + 4} />
							))}
						</Stack>
					</Paper>
				)}
			</Box>
        </Container>
    );
}
