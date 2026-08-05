"use client";

import { useMemo, useState, useCallback } from "react";
import {
	Box,
	Typography,
	Stack,
	ToggleButtonGroup,
	ToggleButton,
} from "@mui/material";
import { createAvatar } from "@dicebear/core";
import { create, meta, schema } from "@dicebear/micah";

const micahStyle = { create, meta, schema };
import {
	avatarSchemaProperties,
	propertyLabels,
	getEnumOptions,
	getDefaultValue,
	getColorOptions,
	type AvatarSchemaProperty,
} from "@/lib/avatarOptions";

type AvatarOptions = Record<string, string | number | boolean | string[] | number[]>;

const PREVIEW_SIZE = 200;
const OPTIONAL_COMPONENTS = ["hair", "earrings", "glasses", "facialHair"];
const NONE = "none";

const EDITOR_GROUPS: { title: string; keys: string[] }[] = [
	{ title: "Visage", keys: ["baseColor", "ears", "eyebrows", "eyebrowsColor", "eyes", "eyesColor", "eyeShadowColor", "nose", "mouth", "mouthColor", "facialHair", "facialHairColor"] },
	{ title: "Cheveux", keys: ["hair", "hairColor"] },
	{ title: "Accessoires", keys: ["earrings", "earringColor", "glasses", "glassesColor"] },
	{ title: "Vêtements", keys: ["shirt", "shirtColor"] },
	{ title: "Fond", keys: ["backgroundColor", "backgroundType"] },
];

const PROBABILITY_KEYS = ["hairProbability", "glassesProbability", "earringsProbability", "facialHairProbability"];

function getOptionsFromSeed(seed: string): AvatarOptions {
	const opts: AvatarOptions = { size: PREVIEW_SIZE };
	try {
		const avatar = createAvatar(micahStyle, { seed, size: 1 });
		const { extra } = avatar.toJson() as { extra?: Record<string, string | undefined> };
		if (!extra) return buildInitialOptions();

		const toHex = (v: string | undefined) =>
			v && v !== "transparent" ? v.replace(/^#/, "") : undefined;

		const componentKeys = ["base", "mouth", "eyebrows", "hair", "eyes", "nose", "ears", "shirt", "earrings", "glasses", "facialHair"];
		for (const key of componentKeys) {
			const val = extra[key];
			if (val) opts[key] = [val];
			else if (OPTIONAL_COMPONENTS.includes(key)) opts[key] = [NONE];
		}

		const colorKeys = ["baseColor", "earringColor", "eyeShadowColor", "eyebrowsColor", "facialHairColor", "glassesColor", "hairColor", "mouthColor", "shirtColor", "eyesColor"];
		for (const key of colorKeys) {
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

function buildInitialOptions(): AvatarOptions {
	const opts: AvatarOptions = { size: PREVIEW_SIZE };
	for (const [key, prop] of Object.entries(avatarSchemaProperties)) {
		if (PROBABILITY_KEYS.includes(key) || key === "seed") continue;
		const def = getDefaultValue(prop as AvatarSchemaProperty, key);
		if (def !== undefined) {
			opts[key] = Array.isArray(def) ? (def as string[]) : (def as string | number | boolean);
		}
	}
	return opts;
}

export interface AvatarEditorProps {
	seed?: string;
}

export default function AvatarEditor({ seed = "" }: AvatarEditorProps) {
	const [options, setOptions] = useState<AvatarOptions>(() =>
		seed ? getOptionsFromSeed(seed) : buildInitialOptions()
	);

	const dataUrl = useMemo(() => {
		const opts: Record<string, unknown> = { ...options, size: PREVIEW_SIZE };
		const first = (arr: unknown) => (Array.isArray(arr) ? arr[0] : undefined);

		for (const key of OPTIONAL_COMPONENTS) {
			const probKey = `${key}Probability`;
			opts[probKey] = first(opts[key]) === NONE ? 0 : 100;
		}

		const svg = createAvatar(micahStyle, opts as Record<string, string | number>).toString();
		return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
	}, [options]);

	const updateOption = useCallback((key: string, value: string | number | boolean | string[] | number[]) => {
		setOptions((prev) => ({ ...prev, [key]: value }));
	}, []);

	const renderControl = (key: string) => {
		const prop = avatarSchemaProperties[key] as AvatarSchemaProperty | undefined;
		if (!prop) return null;

		const label = propertyLabels[key] ?? key;
		const enumOpts = getEnumOptions(prop);

		if (enumOpts) {
			const hasNone = OPTIONAL_COMPONENTS.includes(key);
			const choices = hasNone ? [NONE, ...enumOpts] : enumOpts;
			const current = (options[key] as string) ?? (Array.isArray((prop as { default?: unknown[] }).default) ? (prop as { default: string[] }).default[0] : choices[0]);
			const value = Array.isArray(current) ? current[0] : current;
			return (
				<Box key={key} sx={{ mb: 2, minWidth: 0, overflow: "hidden" }}>
					<Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
						{label}
					</Typography>
					<ToggleButtonGroup
						value={value ?? choices[0]}
						exclusive
						onChange={(_, v) => v != null && updateOption(key, [v])}
						size="small"
						sx={{ flexWrap: "wrap", gap: 0.5, maxWidth: "100%" }}
					>
						{choices.map((opt) => (
							<ToggleButton key={opt} value={opt}>
								{opt === NONE ? "Aucun" : opt}
							</ToggleButton>
						))}
					</ToggleButtonGroup>
				</Box>
			);
		}

		if (prop.type === "array" && (prop.items as { pattern?: string })?.pattern) {
			const colors = getColorOptions(prop);
			const current = (options[key] as string[]) ?? colors;
			const value = Array.isArray(current) ? current[0] : current;
			return (
				<Box key={key} sx={{ mb: 2, minWidth: 0, overflow: "hidden" }}>
					<Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
						{label}
					</Typography>
					<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, maxWidth: "100%" }}>
						{colors.map((c) => (
							<Box
								key={c}
								onClick={() => updateOption(key, [c])}
								sx={{
									width: 28,
									height: 28,
									borderRadius: "50%",
									bgcolor: c === "transparent" ? "transparent" : `#${c}`,
									border: "2px solid",
									borderColor: value === c ? "primary.main" : "divider",
									cursor: "pointer",
									"&:hover": { borderColor: "primary.light" },
								}}
								title={c}
							/>
						))}
					</Box>
				</Box>
			);
		}

		return null;
	};

	return (
		<Stack direction={{ xs: "column", md: "row" }} spacing={4} sx={{ p: 2, flex: 1, minHeight: 0, overflow: "hidden" }}>
			<Box sx={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
				<Box
					component="img"
					src={dataUrl}
					alt="Avatar"
					sx={{
						width: PREVIEW_SIZE,
						height: PREVIEW_SIZE,
						borderRadius: 2,
						bgcolor: "action.hover",
						boxShadow: 2,
					}}
				/>
			</Box>
			<Box sx={{ flex: 1, minWidth: 0, maxWidth: "100%", minHeight: 0, overflowY: "auto", overflowX: "hidden", px: 2 }}>
				{EDITOR_GROUPS.map(({ title, keys }) => {
					const visibleKeys = keys.filter((k) => avatarSchemaProperties[k]);
					if (visibleKeys.length === 0) return null;
					return (
						<Box key={title} sx={{ mb: 3, minWidth: 0 }}>
							<Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
								{title}
							</Typography>
							{visibleKeys.map(renderControl)}
						</Box>
					);
				})}
			</Box>
		</Stack>
	);
}
