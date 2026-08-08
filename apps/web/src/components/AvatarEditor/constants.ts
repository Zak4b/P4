import { avatarSchemaProperties, getEnumOptions, isColorField, type AvatarSchemaProperty } from "./avatarOptions";

export const PREVIEW_SIZE = 200;
export const SWATCH_SIZE = 90;
export const EDITOR_HEIGHT = { xs: 640, md: 560 };
export const NONE = "none";
export type FieldTag = "face" | "hair" | "accessories" | "clothing" | "background" | "other";

// github.com/dicebear/dicebear (apps/editor/src/utils/getSchemaOptions.ts)
const GROUP_FIELDS: Record<Exclude<FieldTag, "other">, string[]> = {
	face: [
		"base",
		"baseColor",
		"ears",
		"eyes",
		"eyesColor",
		"eyeShadowColor",
		"nose",
		"mouth",
		"mouthColor",
		"facialHair",
		"facialHairColor",
	],
	hair: ["hair", "hairColor", "eyebrows", "eyebrowsColor"],
	accessories: ["earrings", "earringColor", "glasses", "glassesColor"],
	clothing: ["shirt", "shirtColor"],
	background: ["backgroundColor", "backgroundType"],
} as const;

// backgroundColor/backgroundType matchent les mêmes heuristiques (couleur / enum) que les autres
// clés ci-dessous mais sont traités à part (voir utils.ts) : le JSON d'un seed les expose sous
// d'autres clés (primaryBackgroundColor, secondaryBackgroundColor).
const BACKGROUND_FIELDS = new Set(GROUP_FIELDS.background);

const isComponentField = (prop: AvatarSchemaProperty | undefined): boolean => getEnumOptions(prop) != null;

export const COMPONENT_KEYS = Object.entries(avatarSchemaProperties)
	.filter(([key, prop]) => isComponentField(prop) && !BACKGROUND_FIELDS.has(key))
	.map(([key]) => key);

export const COLOR_KEYS = Object.entries(avatarSchemaProperties)
	.filter(([key, prop]) => isColorField(prop) && !BACKGROUND_FIELDS.has(key))
	.map(([key]) => key);

// Un composant est "optionnable" (choix "Aucun(e)") dès que dicebear expose une probabilité pour
// lui dans son schéma (ex. glassesProbability) — peu importe sa valeur par défaut.
export const OPTIONAL_COMPONENTS = COMPONENT_KEYS.filter((key) => `${key}Probability` in avatarSchemaProperties);

export const PROBABILITY_KEYS = OPTIONAL_COMPONENTS.map((key) => `${key}Probability`);

// Filet de sécurité : toute clé affichable (couleur ou variante) qu'on aurait oublié de ranger
// dans une famille ci-dessus (ex. si dicebear ajoute une option) atterrit dans "Autre" plutôt que
// de disparaître silencieusement de l'éditeur.
const ASSIGNED_FIELDS = new Set(Object.values(GROUP_FIELDS).flat());
const OTHER_FIELDS = [...COMPONENT_KEYS, ...COLOR_KEYS].filter((key) => !ASSIGNED_FIELDS.has(key));

const RESOLVED_FIELDS: Record<FieldTag, string[]> = { ...GROUP_FIELDS, other: OTHER_FIELDS };

const GROUP_TITLES: Record<FieldTag, string> = {
	face: "Visage",
	hair: "Cheveux",
	accessories: "Accessoires",
	clothing: "Vêtements",
	background: "Fond",
	other: "Autre",
};

export const EDITOR_GROUPS: { title: string; keys: string[] }[] = (Object.keys(GROUP_TITLES) as FieldTag[]).map(
	(tag) => ({
		title: GROUP_TITLES[tag],
		keys: RESOLVED_FIELDS[tag],
	}),
);

export const TRANSPARENT_SWATCH =
	"linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)";
