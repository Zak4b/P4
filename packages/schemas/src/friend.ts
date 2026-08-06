import { z } from "zod";
import { userSchema } from "./user.js";

export const friendRequestSchema = z.object({
	id: z.string().meta({ example: "16fd2706-8baf-433b-82eb-8c7fada847da" }),
	fromUser: userSchema,
	toUser: userSchema,
	createdAt: z.number().int().meta({ example: 1786026731000 }),
});

export const friendRequestDirectionSchema = z.enum(["in", "out"]);

export const friendRequestQuerySchema = z.object({
	direction: friendRequestDirectionSchema.default("in"),
});

export const createFriendRequestSchema = z.object({
	toUserId: z.string().min(1).meta({ example: "f47ac10b-58cc-4372-a567-0e02b2c3d479" }),
});

export const relationStatusSchema = z.enum(["none", "pending", "friends"]);

export const relationSchema = z.object({
	status: relationStatusSchema,
});

export type FriendRequest = z.infer<typeof friendRequestSchema>;
export type FriendRequestDirection = z.infer<typeof friendRequestDirectionSchema>;
export type FriendRequestQuery = z.infer<typeof friendRequestQuerySchema>;
export type CreateFriendRequestBody = z.infer<typeof createFriendRequestSchema>;
export type RelationStatus = z.infer<typeof relationStatusSchema>;
export type Relation = z.infer<typeof relationSchema>;
