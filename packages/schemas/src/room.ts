import { z } from "zod";

export const roomStatusSchema = z.enum(["idle", "playing"]);

export const roomSchema = z.object({
	id: z.string(),
	name: z.string(),
	count: z.number().int(),
	max: z.number().int(),
	joinable: z.boolean(),
	status: roomStatusSchema,
});

export const createRoomSchema = z.object({
	name: z.string().max(20).optional(),
	players: z.array(z.uuid()).optional(),
});

export const roomIdParamsSchema = z.object({
	id: z.string().min(1).max(64),
});

export type RoomStatus = z.infer<typeof roomStatusSchema>;
export type Room = z.infer<typeof roomSchema>;
export type CreateRoomBody = z.infer<typeof createRoomSchema>;
export type RoomIdParams = z.infer<typeof roomIdParamsSchema>;
