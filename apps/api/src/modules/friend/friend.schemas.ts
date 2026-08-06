import { z } from "zod";

export const friendSchema = z.object({
	id: z.string(),
	login: z.string(),
	eloRating: z.number().int(),
});

export const friendRequestSchema = z.object({
	id: z.string(),
	fromUser: friendSchema,
});

export const relationStatusSchema = z.enum(["none", "pending", "friends"]);

export const relationSchema = z.object({
	status: relationStatusSchema,
});
