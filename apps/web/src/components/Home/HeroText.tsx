import { Box, Typography } from "@mui/material";

export function HeroText() {
	return (
		<Box>
			<Typography
				variant="overline"
				sx={{
					fontWeight: 700,
					letterSpacing: 2,
					background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
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
					background: "linear-gradient(to right, #1e293b, #475569)",
					backgroundClip: "text",
					WebkitBackgroundClip: "text",
					color: "transparent",
				}}
			>
				Master <br />
				<Box component="span" sx={{ color: "#6366f1" }}>
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
