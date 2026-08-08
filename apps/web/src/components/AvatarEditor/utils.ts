import { createAvatar } from "@dicebear/core";
import { micahStyle } from "@/lib/avatar";
import { avatarSchemaProperties, getDefaultValue, type AvatarSchemaProperty } from "./avatarOptions";
import { COLOR_KEYS, COMPONENT_KEYS, NONE, OPTIONAL_COMPONENTS, PREVIEW_SIZE, PROBABILITY_KEYS } from "./constants";

export type AvatarOptions = Record<string, string | number | boolean | string[] | number[]>;

export function isHex(value: string): boolean {
	return /^[a-fA-F0-9]{6}$/.test(value);
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
