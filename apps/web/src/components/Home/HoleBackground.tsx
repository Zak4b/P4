import { Box } from "@mui/material";

import type { Theme } from "@mui/material/styles";

/** Le motif suit le mode courant : les aplats viennent de `palette.tint`. */
const tintedHoles = (theme: Theme) => {
	const { holeRed, holeYellow, hole } = theme.vars.palette.tint;
	return [
		`radial-gradient(circle at 28px 28px, ${holeRed} 10px, transparent 11px)`,
		`radial-gradient(circle at 140px 84px, ${holeRed} 10px, transparent 11px)`,
		`radial-gradient(circle at 84px 140px, ${holeYellow} 10px, transparent 11px)`,
		`radial-gradient(circle at 28px 84px, ${holeYellow} 10px, transparent 11px)`,
		`radial-gradient(circle, ${hole} 10px, transparent 11px)`,
	].join(", ");
};

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
				backgroundImage: tintedHoles,
				backgroundSize: TINTED_HOLE_SIZES,
				backgroundPosition: "center",
				maskImage: FADE_OUT,
				WebkitMaskImage: FADE_OUT,
			}}
		/>
	);
}
