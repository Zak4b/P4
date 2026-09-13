import { Box } from "@mui/material";

import { colors } from "@/lib/styles";

const TINTED_HOLES = [
	`radial-gradient(circle at 28px 28px, ${colors.holeRed} 10px, transparent 11px)`,
	`radial-gradient(circle at 140px 84px, ${colors.holeRed} 10px, transparent 11px)`,
	`radial-gradient(circle at 84px 140px, ${colors.holeYellow} 10px, transparent 11px)`,
	`radial-gradient(circle at 28px 84px, ${colors.holeYellow} 10px, transparent 11px)`,
	`radial-gradient(circle, ${colors.holePattern} 10px, transparent 11px)`,
].join(", ");

const TINTED_HOLE_SIZES = "168px 168px, 168px 168px, 168px 168px, 168px 168px, 56px 56px";

const FADE_OUT = "radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 75%)";

export function HoleBackground() {
	return (
		<Box
			aria-hidden
			sx={{
				position: "absolute",
				inset: 0,
				zIndex: 0,
				backgroundImage: TINTED_HOLES,
				backgroundSize: TINTED_HOLE_SIZES,
				backgroundPosition: "center",
				maskImage: FADE_OUT,
				WebkitMaskImage: FADE_OUT,
			}}
		/>
	);
}
