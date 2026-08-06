import { z } from "zod";

export const roomStatusSchema = z.enum(["idle", "playing"]);

export const roomSchema = z.object({
	id: z.string().meta({ example: "3f2504e0-4f89-41d3-9a0c-0305e82c3301" }),
	name: z.string().meta({ example: "Partie du soir" }),
	count: z.number().int().meta({ example: 1 }),
	max: z.number().int().meta({ example: 2 }),
	joinable: z.boolean().meta({ example: true }),
	status: roomStatusSchema,
});

export const createRoomSchema = z.object({
	name: z.string().max(20).optional().meta({ example: "Partie du soir" }),

	invited: z
		.array(z.uuid())
		.max(8)
		.optional()
		.meta({ example: ["f47ac10b-58cc-4372-a567-0e02b2c3d479"] }),
});

export const roomIdParamsSchema = z.object({
	id: z.string().min(1).max(64).meta({ example: "3f2504e0-4f89-41d3-9a0c-0305e82c3301" }),
});

export type RoomStatus = z.infer<typeof roomStatusSchema>;
export type Room = z.infer<typeof roomSchema>;
export type CreateRoomBody = z.infer<typeof createRoomSchema>;
export type RoomIdParams = z.infer<typeof roomIdParamsSchema>;
