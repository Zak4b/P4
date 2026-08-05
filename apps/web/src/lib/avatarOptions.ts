import { schema as coreSchema } from "@dicebear/core";
import { schema as micahSchema } from "@dicebear/micah";

export const avatarSchemaProperties = {
	...coreSchema.properties,
	...micahSchema.properties,
} as Record<string, AvatarSchemaProperty>;

export type AvatarSchemaProperty =
	| { type: "string" }
	| { type: "boolean"; default?: boolean }
	| { type: "integer"; minimum?: number; maximum?: number; default?: number }
	| {
			type: "array";
			items?: { type: string; enum?: string[]; pattern?: string };
			default?: unknown[];
	  };

export const propertyLabels: Record<string, string> = {
	backgroundColor: "Couleur de fond",
	backgroundType: "Type de fond",
	base: "Base",
	baseColor: "Couleur de peau",
	earringColor: "Couleur des boucles",
	earrings: "Boucles d'oreille",
	ears: "Oreilles",
	eyeShadowColor: "Couleur fard à paupières",
	eyebrows: "Sourcils",
	eyebrowsColor: "Couleur sourcils",
	eyes: "Yeux",
	eyesColor: "Couleur des yeux",
	facialHair: "Barbe / moustache",
	facialHairColor: "Couleur barbe",
	glasses: "Lunettes",
	glassesColor: "Couleur lunettes",
	hair: "Coiffure",
	hairColor: "Couleur des cheveux",
	mouth: "Bouche",
	mouthColor: "Couleur bouche",
	nose: "Nez",
	shirt: "Haut",
	shirtColor: "Couleur du haut",
};

export function getColorOptions(prop: AvatarSchemaProperty): string[] {
	if (prop?.type === "array" && "default" in prop) {
		const def = prop.default;
		if (Array.isArray(def)) return def as string[];
	}
	return ["000000", "ffffff", "77311d", "ac6651", "f9c9b6", "9287ff", "6bd9e9"];
}

export function getEnumOptions(prop: AvatarSchemaProperty): string[] | null {
	if (prop?.type === "array" && prop.items && "enum" in prop.items) {
		return prop.items.enum ?? null;
	}
	return null;
}

export function getDefaultValue(prop: AvatarSchemaProperty, key: string): unknown {
	if ("default" in prop && prop.default !== undefined) return prop.default;
	if (prop?.type === "boolean") return false;
	if (prop?.type === "integer") {
		const p = prop as { minimum?: number; maximum?: number };
		return p.minimum ?? 0;
	}
	if (prop?.type === "array" && "items" in prop) {
		const items = prop.items as { enum?: string[] };
		return items?.enum?.[0] ?? "000000";
	}
	return undefined;
}
