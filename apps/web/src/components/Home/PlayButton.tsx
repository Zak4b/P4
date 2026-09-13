import Link from "next/link";
import { Button } from "@mui/material";
import { PlayArrow as PlayIcon } from "@mui/icons-material";

import { colors } from "@/lib/styles";

export function PlayButton() {
	return (
		<Button
			component={Link}
			href="/play"
			variant="contained"
			size="large"
			startIcon={<PlayIcon />}
			sx={{
				px: 4,
				py: 1.5,
				fontSize: "1.1rem",
				fontWeight: 700,
				borderRadius: 3,
				backgroundColor: colors.primary,
				boxShadow: "0 10px 20px -5px rgba(99, 102, 241, 0.4)",
				transition: "all 0.3s ease",
				"&:hover": {
					backgroundColor: colors.primaryHover,
					transform: "translateY(-2px)",
					boxShadow: "0 15px 25px -5px rgba(99, 102, 241, 0.5)",
				},
			}}
		>
			Play Now
		</Button>
	);
}
