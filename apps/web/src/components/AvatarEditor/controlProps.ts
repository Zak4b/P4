import {
	avatarSchemaProperties,
	getEnumOptions,
	getColorOptions,
	isColorField,
	type AvatarSchemaProperty,
} from "./fieldOptions";
import { getChoices } from "./fields";
import { propertyLabels } from "./fieldGroups";
import type { AvatarOptions } from "./avatarState";

export type ControlDescriptor =
	| { type: "enum"; label: string; choices: string[]; value: string }
	| { type: "color"; label: string; colors: string[]; value: string };

/** Détermine quel contrôle afficher pour une clé du schéma, et avec quelles props, selon la valeur
 * actuellement sélectionnée dans `options`. Retourne null pour les clés sans contrôle (ex. "size"). */
export function getControlDescriptor(key: string, options: AvatarOptions): ControlDescriptor | null {
	const prop = avatarSchemaProperties[key] as AvatarSchemaProperty | undefined;
	if (!prop) return null;

	const label = propertyLabels[key] ?? key;
	const enumOpts = getEnumOptions(prop);

	if (enumOpts) {
		const choices = getChoices(key, enumOpts);
		const current =
			(options[key] as string) ??
			(Array.isArray((prop as { default?: unknown[] }).default)
				? (prop as { default: string[] }).default[0]
				: choices[0]);
		const value = Array.isArray(current) ? current[0] : current;
		return { type: "enum", label, choices, value: value ?? choices[0] };
	}

	if (isColorField(prop)) {
		const colors = getColorOptions(prop);
		const current = (options[key] as string[]) ?? colors;
		const value = Array.isArray(current) ? current[0] : current;
		return { type: "color", label, colors, value: value ?? colors[0] ?? "000000" };
	}

	return null;
}
