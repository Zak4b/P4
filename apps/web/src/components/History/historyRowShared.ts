import type { Match } from "@p4/schemas/match";

export type { Match };

/** Rouge (joueur 1, qui commence) ou jaune (joueur 2). */
export type Seat = "player1" | "player2";

/**
 * Une partie de l'historique d'un joueur : le siège gagnant, et celui du
 * joueur dont on affiche le profil.
 */
export interface GameView {
	match: Match;
	/** `null` pour un nul. */
	winner: Seat | null;
	/** Siège du joueur suivi ; `null` s'il n'a pas joué cette partie. */
	mySeat: Seat | null;
}

export function toGameView(match: Match, playerId: string | undefined): GameView {
	return { match, winner: winnerSeat(match), mySeat: seatOf(match, playerId) };
}

function winnerSeat(match: Match): Seat | null {
	if (match.winner === "PLAYER1") {
		return "player1";
	}
	return match.winner === "PLAYER2" ? "player2" : null;
}

function seatOf(match: Match, myId: string | undefined): Seat | null {
	if (match.player1.id === myId) {
		return "player1";
	}
	return match.player2.id === myId ? "player2" : null;
}

/** « 4:05 » : minutes et secondes, sans unité à recopier sur chaque ligne. */
export function formatDuration(seconds: number): string {
	const m = Math.floor(seconds / 60);
	const s = Math.round(seconds % 60);
	return `${m}:${s.toString().padStart(2, "0")}`;
}

const TIME = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" });
const DAY = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" });
const DAY_YEAR = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" });

/** Date lisible pour la récence : « Aujourd'hui », « Hier », sinon le jour. */
export function formatDay(time: number, now = new Date()): string {
	const date = new Date(time);
	const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
	const dayMs = 24 * 60 * 60 * 1000;
	if (time >= startOfToday) {
		return "Aujourd'hui";
	}
	if (time >= startOfToday - dayMs) {
		return "Hier";
	}
	return date.getFullYear() === now.getFullYear() ? DAY.format(date) : DAY_YEAR.format(date);
}

export function formatTime(time: number): string {
	return TIME.format(new Date(time));
}
