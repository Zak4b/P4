import { GameWinner } from "../../generated/prisma/client.js";
import { XP_MATCH_NUL, XP_PARTIE_JOUEE, XP_VICTOIRE } from "@p4/leveling";

export function calculateXpGain(winner: GameWinner, isPlayer1: boolean): number {
	let xp = XP_PARTIE_JOUEE;

	if (winner === GameWinner.DRAW) {
		xp += XP_MATCH_NUL;
	} else if ((winner === GameWinner.PLAYER1 && isPlayer1) || (winner === GameWinner.PLAYER2 && !isPlayer1)) {
		xp += XP_VICTOIRE;
	}

	return xp;
}
