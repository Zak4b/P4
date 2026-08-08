import { avatarSchemaProperties, getEnumOptions, isColorField, type AvatarSchemaProperty } from "./fieldOptions";
import { NONE } from "./ui";

// backgroundColor/backgroundType matchent les mêmes heuristiques (couleur / enum) que les autres
// clés ci-dessous mais sont extraites autrement depuis un seed (voir avatarState.ts : le JSON
// d'un seed les expose sous d'autres clés, primaryBackgroundColor/secondaryBackgroundColor) — il
// ne faut donc pas les traiter comme les autres clés couleur/composant génériques.
const BACKGROUND_FIELDS = new Set(["backgroundColor", "backgroundType"]);

const isComponentField = (prop: AvatarSchemaProperty | undefined): boolean => getEnumOptions(prop) != null;

export const COMPONENT_KEYS = Object.entries(avatarSchemaProperties)
	.filter(([key, prop]) => isComponentField(prop) && !BACKGROUND_FIELDS.has(key))
	.map(([key]) => key);

export const COLOR_KEYS = Object.entries(avatarSchemaProperties)
	.filter(([key, prop]) => isColorField(prop) && !BACKGROUND_FIELDS.has(key))
	.map(([key]) => key);

// Un composant est optionel dès que dicebear expose une probabilité
export const OPTIONAL_COMPONENTS = COMPONENT_KEYS.filter((key) => `${key}Probability` in avatarSchemaProperties);

export const PROBABILITY_KEYS = OPTIONAL_COMPONENTS.map((key) => `${key}Probability`);

export const getChoices = (key: string, enumOpts: string[]): string[] =>
	OPTIONAL_COMPONENTS.includes(key) ? [NONE, ...enumOpts] : enumOpts;
