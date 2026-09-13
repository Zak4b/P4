import { Box, Stack, Typography } from "@mui/material";

interface Stat {
	value: string;
	label: string;
	color: string;
}

const STATS: Stat[] = [
	//{ value: "1k+", label: "Players", color: "rgb(99, 102, 241)" },
	//{ value: "500+", label: "Games/day", color: "rgb(236, 72, 153)" },
];

export function HeroStats() {
	return (
		<Stack direction="row" spacing={4} sx={{ pt: 2 }}>
			{STATS.map((stat, index) => (
				<Box key={index}>
					<Typography variant="h4" sx={{ fontWeight: 800, color: stat.color }}>
						{stat.value}
					</Typography>
					<Typography variant="body2" sx={{ color: "text.secondary" }}>
						{stat.label}
					</Typography>
				</Box>
			))}
		</Stack>
	);
}
