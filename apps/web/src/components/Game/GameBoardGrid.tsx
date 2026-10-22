"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import { BOARD_COLS, BOARD_ROWS, getCell, getPlayerColor, type GameState } from "@/store/game";
import GameBoardCell from "./GameBoardCell";

/* Rapport 7:6 pour conserver les proportions (7 colonnes, 6 rangées) */
export const GRID_ASPECT_RATIO = BOARD_COLS / BOARD_ROWS;

interface GameBoardGridProps {
	gameState: GameState;
	animatingTokens: Set<string>;
	canPlay: boolean;
	onColumnClick: (x: number) => void;
}

/** Première case libre d'une colonne en partant du bas, ou `null` si elle est pleine. */
function landingRow(gameState: GameState, x: number): number | null {
	for (let y = 0; y < BOARD_ROWS; y++) {
		if (getCell(gameState.board, x, y) === "empty") {
			return y;
		}
	}
	return null;
}

export default function GameBoardGrid({
	gameState,
	animatingTokens,
	canPlay,
	onColumnClick,
}: GameBoardGridProps) {
	const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
	const previewY = canPlay && hoveredColumn !== null ? landingRow(gameState, hoveredColumn) : null;
	const previewColor = getPlayerColor(gameState.currentPlayer);

	return (
		<Box
			onMouseLeave={() => setHoveredColumn(null)}
			sx={{
				display: "grid",
				gridTemplateColumns: `repeat(${BOARD_COLS}, 1fr)`,
				gridTemplateRows: `repeat(${BOARD_ROWS}, 1fr)`,
				gap: { xs: 0.25, lg: 0.5 },
				backgroundColor: "board.frame",
				p: { xs: 0.75, lg: 1.5 },
				borderRadius: 3,
				position: "relative",
				// Le jeton entre par le haut du cadre, pas par-dessus la page.
				overflow: "hidden",
				aspectRatio: GRID_ASPECT_RATIO,
				width: "100%",
				maxHeight: "100%",
				minHeight: 0,
			}}
		>
			{Array(BOARD_ROWS)
				.fill(0)
				.map((_, row) =>
					Array(BOARD_COLS)
						.fill(0)
						.map((_, col) => {
							const x = col;
							const y = BOARD_ROWS - 1 - row;

							return (
								<GameBoardCell
									key={`cell-${x}-${y}`}
									color={getCell(gameState.board, x, y)}
									column={col}
									row={row}
									isAnimating={animatingTokens.has(`${x}-${y}`)}
									// Mettre en surbrillance le dernier coup
									isLastMove={gameState.lastMove?.x === x && gameState.lastMove?.y === y}
									canPlay={canPlay}
									preview={hoveredColumn === x && previewY === y ? previewColor : null}
									onSelect={() => onColumnClick(x)}
									onHover={() => setHoveredColumn(x)}
								/>
							);
						})
				)}
		</Box>
	);
}
