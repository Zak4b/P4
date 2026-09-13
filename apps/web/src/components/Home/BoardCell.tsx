import { Box } from "@mui/material";

/** 0 = empty, 1 = red, 2 = yellow. */
export type PreviewCell = 0 | 1 | 2;

/** Les mêmes tokens que le vrai plateau, pour que l'aperçu ne diverge pas. */
const CELL_COLOR: Record<PreviewCell, string> = {
	0: "board.hole",
	1: "board.player1",
	2: "board.player2",
};

const EMPTY_SHADOW = "inset 0 4px 6px rgba(0,0,0,0.1)";
const CHIP_SHADOW = "inset 0 -4px 6px rgba(0,0,0,0.2), 0 4px 6px rgba(0,0,0,0.1)";

/** Shine highlight, only drawn on filled cells. */
const CHIP_SHINE = {
	content: '""',
	position: "absolute",
	top: "10%",
	left: "10%",
	width: "40%",
	height: "40%",
	borderRadius: "50%",
	backgroundColor: "tint.shine",
} as const;

export function BoardCell({ cell }: { cell: PreviewCell }) {
	const isChip = cell !== 0;

	return (
		<Box
			sx={{
				width: "100%",
				paddingTop: "100%",
				borderRadius: "50%",
				bgcolor: CELL_COLOR[cell],
				position: "relative",
				overflow: "hidden",
				boxShadow: isChip ? CHIP_SHADOW : EMPTY_SHADOW,
				"&::after": isChip ? CHIP_SHINE : {},
			}}
		/>
	);
}
