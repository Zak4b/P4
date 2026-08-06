import type { GameHistory } from "@/lib/api";

export type HistoryRowProps = Omit<GameHistory, "board">;

export const formatDate = (dateStr: string | number) =>
	new Date(dateStr).toLocaleDateString("fr-FR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
