import { avatarSchemaProperties, getEnumOptions, type AvatarSchemaProperty } from "./fieldOptions";
import { getChoices } from "./fields";
import { SWATCH_SIZE } from "./ui";

/**
 * Une miniature SVG par choix, pour chaque clé à énumération parmi `keys` (les autres sont
 * ignorées). `renderSvg` rend l'avatar complet pour un jeu d'overrides donné : chaque miniature
 * applique un seul choix à la fois, le reste de l'avatar restant celui actuellement sélectionné.
 */
export function buildEnumPreviews(
	keys: string[],
	renderSvg: (overrides: Record<string, unknown>) => string,
): Record<string, Record<string, string>> {
	const previewsByKey: Record<string, Record<string, string>> = {};
	for (const key of keys) {
		const prop = avatarSchemaProperties[key] as AvatarSchemaProperty | undefined;
		const enumOpts = getEnumOptions(prop);
		if (!enumOpts) continue;

		const previews: Record<string, string> = {};
		for (const choice of getChoices(key, enumOpts)) {
			previews[choice] = renderSvg({ [key]: [choice], size: SWATCH_SIZE });
		}
		previewsByKey[key] = previews;
	}
	return previewsByKey;
}
