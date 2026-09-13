import { Box, Paper } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { Text, Muted } from "@/components/ui";

interface FeatureCardProps {
	icon: React.ReactNode;
	title: string;
	caption: string;
	/** Background of the icon square. */
	tint: string;
	/** Text colour of the icon. */
	iconColor: string;
	/** Duration and delay of the floating animation, e.g. "6s ease-in-out infinite". */
	float: string;
	/** Where the card sits inside the showcase. */
	position: SxProps<Theme>;
}

/** Small card floating above the board preview. */
export function FeatureCard({ icon, title, caption, tint, iconColor, float, position }: FeatureCardProps) {
	return (
		<Paper
			elevation={4}
			sx={{
				position: "absolute",
				p: 2,
				borderRadius: 4,
				display: "flex",
				alignItems: "center",
				gap: 2,
				animation: `float ${float}`,
				"@keyframes float": {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-20px)" },
				},
				...position,
			}}
		>
			<Box
				sx={{
					width: 48,
					height: 48,
					borderRadius: 3,
					bgcolor: tint,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					color: iconColor,
				}}
			>
				{icon}
			</Box>
			<Box>
				<Text variant="subtitle2" sx={{ fontWeight: 700 }}>
					{title}
				</Text>
				<Muted variant="caption">{caption}</Muted>
			</Box>
		</Paper>
	);
}
