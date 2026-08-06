import { z } from "zod";

export const roomSchema = z.object({
	id: z.string(),
	name: z.string(),
	count: z.number().int(),
	max: z.number().int(),
	joinable: z.boolean(),
	status: z.enum(["idle", "playing"]),
});

/** Corps de création d'une room. */
export const createRoomSchema = z.object({
	name: z.string().max(20).optional(),
	players: z.array(z.uuid()).optional(),
});

export const roomIdParamsSchema = z.object({
	id: z.string().min(1).max(64),
});
