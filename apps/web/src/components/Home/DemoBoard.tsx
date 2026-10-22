"use client";

import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import type { GameState } from "@/store/game";
import GameBoardGrid from "@/components/Game/GameBoardGrid";
import { SCENARIOS, replay, type Scenario } from "./demoGame";

/** Un coup toutes les 650 ms : le jeton a fini sa chute avant le suivant. */
const MOVE_INTERVAL_MS = 650;
/** Temps laissé pour voir la position gagnante avant de vider le plateau. */
const HOLD_END_MS = 2600;
/** Plateau vide entre deux scénarios. */
const HOLD_EMPTY_MS = 500;

const NO_ANIMATION = new Set<string>();

/** Le plateau se regarde : un clic ne joue rien. */
function ignoreClick(): void {
	// rien à faire
}

/**
 * Plateau de la page d'accueil : le vrai composant de grille, qui rejoue en
 * boucle des parties écrites à l'avance. Il se regarde, il ne se joue pas.
 */
export function DemoBoard() {
	const [scenarioIndex, setScenarioIndex] = useState(0);
	const [count, setCount] = useState(0);

	const scenario: Scenario = SCENARIOS[scenarioIndex % SCENARIOS.length] as Scenario;
	const finished = count >= scenario.length;

	useEffect(() => {
		if (!finished) {
			const delay = count === 0 ? HOLD_EMPTY_MS : MOVE_INTERVAL_MS;
			const timer = setTimeout(() => setCount((c) => c + 1), delay);
			return () => clearTimeout(timer);
		}
		const timer = setTimeout(() => {
			setScenarioIndex((i) => (i + 1) % SCENARIOS.length);
			setCount(0);
		}, HOLD_END_MS);
		return () => clearTimeout(timer);
	}, [count, finished]);

	const { board, lastMove } = replay(scenario, count);

	const gameState: GameState = {
		board,
		currentPlayer: count % 2 === 0 ? 1 : 2,
		lastMove,
		winningPlayer: null,
		isDraw: false,
		isWin: finished,
		loading: false,
		currentRoomId: null,
	};

	return (
		<Box sx={{ width: "100%" }} aria-hidden>
			<GameBoardGrid
				gameState={gameState}
				// Seul le dernier jeton posé tombe ; les autres sont déjà en place.
				animatingTokens={lastMove ? new Set([`${lastMove.x}-${lastMove.y}`]) : NO_ANIMATION}
				canPlay={false}
				onColumnClick={ignoreClick}
			/>
		</Box>
	);
}
