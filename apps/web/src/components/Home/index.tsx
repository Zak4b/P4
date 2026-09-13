import { Box, Container, Grid, Stack } from "@mui/material";

import { HeroShowcase } from "./HeroShowcase";
import { HeroStats } from "./HeroStats";
import { HeroText } from "./HeroText";
import { HoleBackground } from "./HoleBackground";
import { PlayButton } from "./PlayButton";

export default function HomeHero() {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				minHeight: "100vh",
				position: "relative",
				overflow: "hidden",
			}}
		>
			<HoleBackground />

			<Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: 8 }}>
				<Grid container spacing={6} sx={{ alignItems: "center" }}>
					<Grid size={{ xs: 12, md: 6 }}>
						<Stack spacing={4}>
							<HeroText />
							<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
								<PlayButton />
							</Stack>
							<HeroStats />
						</Stack>
					</Grid>

					<Grid size={{ xs: 12, md: 6 }}>
						<HeroShowcase />
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
}
