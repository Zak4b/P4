import { createAvatar } from "@dicebear/core";
import { micahStyle } from "@/lib/avatar";
import { avatarSchemaProperties, getDefaultValue, type AvatarSchemaProperty } from "./fieldOptions";
import { COLOR_KEYS, COMPONENT_KEYS, OPTIONAL_COMPONENTS, PROBABILITY_KEYS } from "./fields";
import { NONE, PREVIEW_SIZE } from "./ui";

export type AvatarOptions = Record<string, string | number | boolean | string[] | number[]>;

export function isHex(value: string): boolean {
	return /^[a-fA-F0-9]{6}$/.test(value);
}

// Complète les options choisies par l'utilisateur avec les *Probability requis par dicebear pour
// qu'un composant optionnel (hair, glasses...) soit effectivement rendu ou omis : "Aucun(e)"
// sélectionné → probabilité 0, sinon 100. `overrides` permet de simuler un choix différent (ex.
// pour générer la miniature d'un autre choix) sans toucher aux options réellement sélectionnées.
export function resolveAvatarOptions(
	options: AvatarOptions,
	overrides: Record<string, unknown> = {},
): Record<string, unknown> {
	const opts: Record<string, unknown> = { ...options, ...overrides };
	const first = (arr: unknown) => (Array.isArray(arr) ? arr[0] : undefined);

	for (const key of OPTIONAL_COMPONENTS) {
		const probKey = `${key}Probability`;
		opts[probKey] = first(opts[key]) === NONE ? 0 : 100;
	}
	return opts;
}

export function getOptionsFromSeed(seed: string): AvatarOptions {
	const opts: AvatarOptions = { size: PREVIEW_SIZE };
	try {
		const avatar = createAvatar(micahStyle, { seed, size: 1 });
		const { extra } = avatar.toJson() as { extra?: Record<string, string | undefined> };
		if (!extra) return buildInitialOptions();

		const toHex = (v: string | undefined) => (v && v !== "transparent" ? v.replace(/^#/, "") : undefined);

		for (const key of COMPONENT_KEYS) {
			const val = extra[key];
			if (val) opts[key] = [val];
			else if (OPTIONAL_COMPONENTS.includes(key)) opts[key] = [NONE];
		}

		for (const key of COLOR_KEYS) {
			const hex = toHex(extra[key]);
			if (hex) opts[key] = [hex];
		}

		const bgPrimary = toHex(extra.primaryBackgroundColor);
		const bgSecondary = toHex(extra.secondaryBackgroundColor);
		if (bgPrimary) opts.backgroundColor = bgSecondary ? [bgPrimary, bgSecondary] : [bgPrimary];
		if (extra.backgroundType) opts.backgroundType = [extra.backgroundType];
	} catch {
		return buildInitialOptions();
	}
	return { ...buildInitialOptions(), ...opts };
}

export function buildInitialOptions(): AvatarOptions {
	const opts: AvatarOptions = { size: PREVIEW_SIZE };
	for (const [key, prop] of Object.entries(avatarSchemaProperties)) {
		if (PROBABILITY_KEYS.includes(key) || key === "seed") continue;
		const def = getDefaultValue(prop as AvatarSchemaProperty);
		if (def !== undefined) {
			opts[key] = Array.isArray(def) ? (def as string[]) : (def as string | number | boolean);
		}
	}
	return opts;
}
