"use client";

import { Box } from "@mui/material";
import type { TokenColor } from "@/store/game";

function getTokenColor(color: TokenColor): string {
	switch (color) {
		case "player1":
			return "board.player1";
		case "player2":
			return "board.player2";
		case "empty":
			return "board.frame";
		default:
			return "board.frame";
	}
}

const EMPTY_SHADOW = "inset 0 2px 4px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)";
const TOKEN_SHADOW = "0 2px 4px rgba(0,0,0,0.2)";
const LAST_MOVE_SHADOW =
	"0 0 0 3px rgba(255,255,255,0.9), 0 0 15px rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.2)";

function getTokenShadow(isEmpty: boolean, isLastMove: boolean): string {
	if (isEmpty) {
		return EMPTY_SHADOW;
	}
	return isLastMove ? LAST_MOVE_SHADOW : TOKEN_SHADOW;
}

interface GameBoardCellProps {
	color: TokenColor;
	column: number;
	row: number;
	isAnimating: boolean;
	isLastMove: boolean;
	canPlay: boolean;
	onSelect: () => void;
}

export default function GameBoardCell({
	color,
	column,
	row,
	isAnimating,
	isLastMove,
	canPlay,
	onSelect,
}: GameBoardCellProps) {
	const isEmpty = color === "empty";

	return (
		<Box
			onClick={(e) => {
				e.stopPropagation();
				// Permettre de cliquer sur toute la colonne
				onSelect();
			}}
			sx={{
				gridColumn: column + 1,
				gridRow: row + 1,
				aspectRatio: 1,
				position: "relative",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				cursor: canPlay ? "pointer" : "default",
				zIndex: 1,
				padding: "4px",
			}}
		>
			{/* Cellule vide ou jeton */}
			<Box
				sx={{
					width: "90%",
					height: "90%",
					borderRadius: "50%",
					backgroundColor: isEmpty ? "board.hole" : getTokenColor(color),
					border: isEmpty ? "2px solid" : "none",
					borderColor: isEmpty ? "divider" : "transparent",
					boxShadow: getTokenShadow(isEmpty, isLastMove),
					transition: isAnimating ? "none" : "all 0.2s ease",
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					animation: isAnimating ? "tokenGrow 0.4s ease-out forwards" : "none",
				}}
			/>
		</Box>
	);
}
