import { Box } from "@mui/material";
import { Heading, Text } from "@/components/ui";

export function HeroText() {
	return (
		<Box>
			<Text
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
			</Text>
			<Heading
				level={1}
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
			</Heading>
			<Heading
				level={5}
				sx={{
					fontWeight: 600,
					color: "text.secondary",
					maxWidth: 500,
					lineHeight: 1.6,
				}}
			>
				Challenge friends or players worldwide in the ultimate classic strategy game. Simple to learn, hard to master.
			</Heading>
		</Box>
	);
}
