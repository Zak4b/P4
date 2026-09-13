"use client";

import { Box, Container, Grid, Paper, Stack } from "@mui/material";
import { Heading } from "@/components/ui";
import RuleList from "@/components/Game/Rules/RuleList";
import { useMatching } from "@/hooks/useMatching";
import PlayActionsPanel from "./components/PlayActionsPanel";

export default function PlayIndexPage() {
	const { modal, startMatchmaking } = useMatching();

	return (
		<Container maxWidth="lg" sx={{ py: 6 }}>
			<Grid container spacing={6}>
				{/* Left Column: Actions */}
				<Grid size={{ xs: 12, md: 5 }}>
					<PlayActionsPanel onQuickMatch={startMatchmaking} />
				</Grid>

				{/* Right Column: Info & Rules */}
				<Grid size={{ xs: 12, md: 7 }}>
					<Stack spacing={4}>
						<Box>
							<Heading
								level={5}
								gutterBottom
								sx={{
									fontWeight: "bold",
								}}
							>
								How to Play
							</Heading>
							<Paper variant="outlined" sx={{ borderRadius: 4, overflow: "hidden" }}>
								<RuleList />
							</Paper>
						</Box>
					</Stack>
				</Grid>
			</Grid>
			{modal}
		</Container>
	);
}
