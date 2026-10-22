"use client";

import { Box } from "@mui/material";
import type { TokenColor } from "@/store/game";

const TOKEN_COLOR: Record<Exclude<TokenColor, "empty">, string> = {
	player1: "board.player1",
	player2: "board.player2",
};

/** Le trou est creusé dans le cadre : une ombre interne, pas une bordure. */
const HOLE_SHADOW = "inset 0 3px 0 rgba(0,0,0,0.18)";
/** Le jeton a une tranche : un liseré plus sombre en bas, comme un vrai disque. */
const TOKEN_SHADOW = "inset 0 -4px 0 rgba(0,0,0,0.18)";
const LAST_MOVE_RING = "0 0 0 3px var(--mui-palette-background-paper)";

/** Durée de chute : plus le jeton tombe de haut, plus il met de temps. */
export function dropDurationMs(rows: number): number {
	return 200 + rows * 45;
}

interface GameBoardCellProps {
	color: TokenColor;
	column: number;
	row: number;
	isAnimating: boolean;
	isLastMove: boolean;
	canPlay: boolean;
	/** Jeton fantôme : la case où tomberait le jeton si l'on jouait cette colonne. */
	preview: TokenColor | null;
	onSelect: () => void;
	onHover: () => void;
}

export default function GameBoardCell({
	color,
	column,
	row,
	isAnimating,
	isLastMove,
	canPlay,
	preview,
	onSelect,
	onHover,
}: GameBoardCellProps) {
	const isEmpty = color === "empty";
	// La case de la rangée du haut tombe d'une case, celle du bas de six.
	const drop = row + 1;

	return (
		<Box
			onClick={(e) => {
				e.stopPropagation();
				// Toute la colonne est cliquable
				onSelect();
			}}
			onMouseEnter={onHover}
			sx={{
				gridColumn: column + 1,
				gridRow: row + 1,
				aspectRatio: 1,
				position: "relative",
				cursor: canPlay ? "pointer" : "default",
				// Le jeton qui tombe passe devant les trous vides au-dessus de lui.
				zIndex: isAnimating ? 2 : 1,
			}}
		>
			<Box
				sx={{
					position: "absolute",
					inset: "6%",
					borderRadius: "50%",
					backgroundColor: "board.hole",
					boxShadow: HOLE_SHADOW,
				}}
			/>

			{preview && isEmpty && (
				<Box
					aria-hidden
					sx={{
						position: "absolute",
						inset: "6%",
						borderRadius: "50%",
						backgroundColor: TOKEN_COLOR[preview as keyof typeof TOKEN_COLOR],
						opacity: 0.35,
					}}
				/>
			)}

			{!isEmpty && (
				<Box
					data-motion={isAnimating ? "" : undefined}
					sx={{
						position: "absolute",
						inset: "6%",
						borderRadius: "50%",
						backgroundColor: TOKEN_COLOR[color],
						boxShadow: isLastMove ? `${TOKEN_SHADOW}, ${LAST_MOVE_RING}` : TOKEN_SHADOW,
						transition: "box-shadow 200ms ease",
						"--drop": drop,
						animation: isAnimating ? `tokenDrop ${dropDurationMs(drop)}ms both` : "none",
					}}
				/>
			)}
		</Box>
	);
}
