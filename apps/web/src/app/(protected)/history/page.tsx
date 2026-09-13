"use client";

import {
	Box,
	Button,
	CircularProgress,
	Alert,
	Paper,
	Stack,
	Container,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import { Heading, Muted, Button as KitButton } from "@/components/ui";
import { Refresh as RefreshIcon, History as HistoryIcon } from "@mui/icons-material";
import { useMatchQuery } from "@/lib/api/match/useMatchQuery";
import { layoutStyles, typographyStyles, paperStyles, buttonStyles } from "@/lib/styles";
import HistoryRow from "@/components/History/HistoryRow";
import HistoryRowCompact from "@/components/History/HistoryRowCompact";

export default function HistoryPage() {
	const theme = useTheme();
	const compact = useMediaQuery(theme.breakpoints.down("sm"));
	const Row = compact ? HistoryRowCompact : HistoryRow;
	const matchQuery = useMatchQuery();
	const history = matchQuery.data ?? [];

	if (matchQuery.isLoading) {
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

	if (matchQuery.isError) {
		return (
			<Alert
				severity="error"
				action={
					<Button
						color="inherit"
						size="small"
						onClick={() => {
							matchQuery.refetch().catch((err: unknown) => console.error(err));
						}}
					>
						Retry
					</Button>
				}
			>
				Failed to load history
			</Alert>
		);
	}

	return (
        <Container maxWidth="lg" sx={layoutStyles.container}>
            <Stack
                direction="row"
                sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 4
                }}>
				<Heading
                    level={4}
                    sx={[{
                        fontWeight: 700
                    }, typographyStyles.gradientTitle]}>
					<HistoryIcon />
					Game History
				</Heading>
				<KitButton
					variant="outline"
					startIcon={<RefreshIcon />}
					onClick={() => {
						matchQuery.refetch().catch((err: unknown) => console.error(err));
					}}
					disabled={matchQuery.isFetching}
					sx={buttonStyles.primaryOutlined}
				>
					Refresh
				</KitButton>
			</Stack>

            {history.length === 0 ? (
				<Paper elevation={3} sx={paperStyles.gradientPaperLarge}>
					<Muted variant="h5" gutterBottom>
						No games played yet
					</Muted>
					<Muted variant="body1">Start a game to see your history here!</Muted>
				</Paper>
			) : (
				<Stack spacing={2}>
					{history.map((game) => (
						<Row
							key={game.id}
							id={game.id}
							player1={game.player1}
							player2={game.player2}
							winner={game.winner}
							time={game.time}
							duration={game.duration}
						/>
					))}
				</Stack>
			)}
        </Container>
    );
}
