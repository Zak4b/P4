export const matchKeys = {
	all: ["matches"] as const,
	history: (playerId?: string) => [...matchKeys.all, "history", playerId ?? "all"] as const,
};
