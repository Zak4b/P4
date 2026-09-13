"use client";

import { Box } from "@mui/material";
import { BOARD_COLS, BOARD_ROWS, getCell, type GameState } from "@/store/game";
import GameBoardCell from "./GameBoardCell";

/* Rapport 7:6 pour conserver les proportions (7 colonnes, 6 rangées) */
export const GRID_ASPECT_RATIO = BOARD_COLS / BOARD_ROWS;

interface GameBoardGridProps {
	gameState: GameState;
	animatingTokens: Set<string>;
	canPlay: boolean;
	onColumnClick: (x: number) => void;
}

export default function GameBoardGrid({
	gameState,
	animatingTokens,
	canPlay,
	onColumnClick,
}: GameBoardGridProps) {
	return (
		<Box
			sx={{
				display: "grid",
				gridTemplateColumns: `repeat(${BOARD_COLS}, 1fr)`,
				gridTemplateRows: `repeat(${BOARD_ROWS}, 1fr)`,
				gap: { xs: 0.5, lg: 1 },
				backgroundColor: "board.frame",
				p: { xs: 0.5, lg: 1 },
				borderRadius: 2,
				position: "relative",
				aspectRatio: GRID_ASPECT_RATIO,
				width: "100%",
				maxHeight: "100%",
				minHeight: 0,
			}}
		>
			{/* Grille du jeu */}
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
									onSelect={() => onColumnClick(x)}
								/>
							);
						})
				)}
		</Box>
	);
}
