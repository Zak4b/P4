export type Winner = "PLAYER1" | "PLAYER2" | "DRAW";

export interface HistoryRowProps {
	id: string;
	player1: { id: string; login: string; eloRating?: number };
	player2: { id: string; login: string; eloRating?: number };
	winner: Winner;
	time: number;
	duration: number;
}

export const formatDate = (dateStr: string | number) =>
	new Date(dateStr).toLocaleDateString("fr-FR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

export const formatDuration = (seconds: number) => seconds;
