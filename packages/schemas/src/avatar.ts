import { z } from "zod";
import { schema as coreSchema } from "@dicebear/core";
import { schema as micahSchema } from "@dicebear/micah";

export const AVATAR_STYLE = "micah" as const;

type JsonSchemaProperty = {
	type: string;
	minimum?: number;
	maximum?: number;
	items?: { type: string; enum?: string[]; pattern?: string };
};

const properties = {
	...(coreSchema.properties as Record<string, JsonSchemaProperty>),
	...(micahSchema.properties as Record<string, JsonSchemaProperty>),
};

function propertyToZod(prop: JsonSchemaProperty): z.ZodTypeAny {
	switch (prop.type) {
		case "string":
			return z.string();
		case "boolean":
			return z.boolean();
		case "integer": {
			let s = z.number().int();
			if (prop.minimum !== undefined) s = s.min(prop.minimum);
			if (prop.maximum !== undefined) s = s.max(prop.maximum);
			return s;
		}
		case "array": {
			const items = prop.items;
			let item: z.ZodTypeAny;
			if (items?.enum) item = z.enum(items.enum as [string, ...string[]]);
			else if (items?.pattern) item = z.string().regex(new RegExp(items.pattern));
			else if (items?.type === "integer") item = z.number().int();
			else item = z.string();
			return z.array(item);
		}
		default:
			return z.unknown();
	}
}

const shape = Object.fromEntries(
	Object.entries(properties).map(([key, prop]) => [key, propertyToZod(prop).optional()]),
) as Record<string, z.ZodOptional<z.ZodTypeAny>>;

export const avatarOptionsSchema = z.object(shape).strict();

export const avatarSaveBodySchema = z.object({
	options: avatarOptionsSchema,
});

export const avatarSaveResponseSchema = z.object({
	success: z.literal(true),
});

export type AvatarOptions = z.infer<typeof avatarOptionsSchema>;
export type AvatarSaveBody = z.infer<typeof avatarSaveBodySchema>;
export type AvatarSaveResponse = z.infer<typeof avatarSaveResponseSchema>;
