export const userKeys = {
	all: ["users"] as const,
	detail: (id: string) => [...userKeys.all, id] as const,
	stats: (id: string) => [...userKeys.all, id, "stats"] as const,
	leaderboard: () => [...userKeys.all, "leaderboard"] as const,
	me: () => [...userKeys.all, "me"] as const,
};
