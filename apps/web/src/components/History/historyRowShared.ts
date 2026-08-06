import type { GameHistory } from "@p4/schemas/match";

export type HistoryRowProps = GameHistory;

export const formatDate = (dateStr: string | number) =>
	new Date(dateStr).toLocaleDateString("fr-FR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
