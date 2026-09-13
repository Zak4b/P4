import { Box } from "@mui/material";

import { BoardCell, type PreviewCell } from "./BoardCell";

const BOARD_STATE: PreviewCell[] = [
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 1, 1, 1, 0, 0, 2, 1, 2, 1,
	2, 1, 2,
];

export function BoardPreview() {
	return (
		<Box
			sx={{
				width: 350,
				height: "auto",
				aspectRatio: "7/6",
				bgcolor: "white",
				borderRadius: 4,
				boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
				p: 2,
				display: "grid",
				gridTemplateColumns: "repeat(7, 1fr)",
				gap: 1.5,
				transform: "rotate(-6deg)",
				transition: "transform 0.3s ease",
				"&:hover": {
					transform: "rotate(0deg) scale(1.02)",
				},
			}}
		>
			{BOARD_STATE.map((cell, i) => (
				<BoardCell key={i} cell={cell} />
			))}
		</Box>
	);
}
