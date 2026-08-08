export const matchKeys = {
	all: ["matches"] as const,
	history: () => [...matchKeys.all, "history"] as const,
};
