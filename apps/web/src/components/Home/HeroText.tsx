import { Box, Typography } from "@mui/material";

export function HeroText() {
	return (
		<Box>
			<Typography
				variant="overline"
				sx={{
					fontWeight: 700,
					letterSpacing: 2,
					background: (theme) => theme.vars.palette.gradient.brand,
					backgroundClip: "text",
					WebkitBackgroundClip: "text",
					color: "transparent",
					mb: 2,
					display: "block",
				}}
			>
				CONNECT 4 ONLINE
			</Typography>
			<Typography
				variant="h1"
				sx={{
					fontWeight: 900,
					fontSize: { xs: "3rem", md: "4.5rem" },
					lineHeight: 1.1,
					mb: 2,
					background: (theme) => theme.vars.palette.gradient.heading,
					backgroundClip: "text",
					WebkitBackgroundClip: "text",
					color: "transparent",
				}}
			>
				Master <br />
				<Box component="span" sx={{ color: "primary.main" }}>
					the grid.
				</Box>
			</Typography>
			<Typography
				variant="h5"
				sx={{
					color: "text.secondary",
					maxWidth: 500,
					lineHeight: 1.6,
				}}
			>
				Challenge friends or players worldwide in the ultimate classic strategy game. Simple to learn, hard to master.
			</Typography>
		</Box>
	);
}
