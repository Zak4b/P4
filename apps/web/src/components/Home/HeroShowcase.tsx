import { Box } from "@mui/material";
import { Bolt, Group } from "@mui/icons-material";

import { BoardPreview } from "./BoardPreview";
import { FeatureCard } from "./FeatureCard";

// Board preview
export function HeroShowcase() {
	return (
		<Box
			sx={{
				position: "relative",
				height: 500,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<FeatureCard
				icon={<Bolt fontSize="large" />}
				title="Fast"
				caption="Real-time"
				tint="tint.primary"
				iconColor="primary.main"
				float="6s ease-in-out infinite"
				position={{ top: 40, right: 40 }}
			/>
			<FeatureCard
				icon={<Group fontSize="large" />}
				title="Multiplayer"
				caption="Invite friends"
				tint="tint.secondary"
				iconColor="secondary.main"
				float="7s ease-in-out infinite 1s"
				position={{ bottom: 80, left: 20, zIndex: 2 }}
			/>
			<BoardPreview />
		</Box>
	);
}
