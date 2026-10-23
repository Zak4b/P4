"use client";

import { useMemo, useState, useCallback } from "react";
import {
	Box,
	Stack,
	ToggleButtonGroup,
	ToggleButton,
} from "@mui/material";
import { Text, Muted } from "@/components/ui";
import { Avatar } from "@dicebear/core";
import { micahStyle } from "@/lib/avatar";
import {
	avatarFields,
	propertyLabels,
	getEnumOptions,
	getColorOptions,
	isUnknownArray,
} from "@/lib/avatarOptions";

type AvatarOptions = Record<string, string[]>;

const PREVIEW_SIZE = 200;
const OPTIONAL_COMPONENTS = ["hairVariant", "earringsVariant", "glassesVariant", "facialHairVariant"];
const NONE = "none";
const TRANSPARENT = "transparent";

const EDITOR_GROUPS: { title: string; keys: string[] }[] = [
	{ title: "Visage", keys: ["baseColor", "earsVariant", "eyebrowsVariant", "eyebrowsColor", "eyesVariant", "eyesColor", "eyeShadowColor", "noseVariant", "mouthVariant", "mouthColor", "facialHairVariant", "facialHairColor"] },
	{ title: "Cheveux", keys: ["hairVariant", "hairColor"] },
	{ title: "Accessoires", keys: ["earringsVariant", "earringColor", "glassesVariant", "glassesColor"] },
	{ title: "Vêtements", keys: ["clothesVariant", "shirtColor"] },
	{ title: "Fond", keys: ["backgroundColor", "backgroundColorFill"] },
];

const EDITOR_KEYS = EDITOR_GROUPS.flatMap(({ keys }) => keys);

function getOptionsFromSeed(seed: string): AvatarOptions {
	const opts: AvatarOptions = {};
	try {
		const { options: resolved } = new Avatar(micahStyle, { seed, size: 1 }).toJSON();
		for (const key of EDITOR_KEYS) {
			const raw: unknown = resolved[key];
			const val = isUnknownArray(raw) ? raw[0] : raw;
			if (typeof val === "string") {opts[key] = [val];}
			else if (OPTIONAL_COMPONENTS.includes(key)) {opts[key] = [NONE];}
		}
	} catch {
		return {};
	}
	return opts;
}

export interface AvatarEditorProps {
	seed?: string;
}

type UpdateOption = (key: string, value: string[]) => void;

function renderControl(key: string, options: AvatarOptions, updateOption: UpdateOption) {
	const field = avatarFields[key];
	if (!field) {return null;}

	const label = propertyLabels[key] ?? key;
	const enumOpts = getEnumOptions(field);

	if (enumOpts) {
		const hasNone = OPTIONAL_COMPONENTS.includes(key);
		const choices = hasNone ? [NONE, ...enumOpts] : enumOpts;
		const current = options[key]?.[0];
		const value = current && choices.includes(current) ? current : choices[0];
		return (
                <Box key={key} sx={{ mb: 2, minWidth: 0, overflow: "hidden" }}>
                    <Muted
                        variant="caption"
                        sx={{
                            display: "block",
                            mb: 0.5
                        }}>
					{label}
				</Muted>
                    <ToggleButtonGroup
					value={value}
					exclusive
					onChange={(_, next: string | null) => {
						if (next != null) {
							updateOption(key, [next]);
						}
					}}
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

	if (field.type === "color") {
		const colors = getColorOptions(key);
		const value = options[key]?.[0] ?? colors[0];
		return (
                <Box key={key} sx={{ mb: 2, minWidth: 0, overflow: "hidden" }}>
                    <Muted
                        variant="caption"
                        sx={{
                            display: "block",
                            mb: 0.5
                        }}>
					{label}
				</Muted>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, maxWidth: "100%" }}>
					{colors.map((c) => (
						<Box
							key={c}
							onClick={() => updateOption(key, [c])}
							sx={{
								width: 28,
								height: 28,
								borderRadius: "50%",
								bgcolor: c,
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
}

export default function AvatarEditor({ seed = "" }: AvatarEditorProps) {
	const [options, setOptions] = useState<AvatarOptions>(() => getOptionsFromSeed(seed));

	const dataUrl = useMemo(() => {
		const opts: Record<string, unknown> = { ...options, size: PREVIEW_SIZE };

		for (const key of OPTIONAL_COMPONENTS) {
			const none = options[key]?.[0] === NONE;
			opts[key.replace(/Variant$/, "Probability")] = none ? 0 : 100;
			if (none) {delete opts[key];}
		}
		if (options.backgroundColor?.[0] === TRANSPARENT) {delete opts.backgroundColor;}

		const svg = new Avatar(micahStyle, opts).toString();
		return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
	}, [options]);

	const updateOption = useCallback((key: string, value: string[]) => {
		setOptions((prev) => ({ ...prev, [key]: value }));
	}, []);


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
					const visibleKeys = keys.filter((k) => avatarFields[k]);
					if (visibleKeys.length === 0) {return null;}
					return (
                        <Box key={title} sx={{ mb: 3, minWidth: 0 }}>
                            <Text
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 600,
                                    mb: 1.5
                                }}>
								{title}
							</Text>
                            {visibleKeys.map((key) => renderControl(key, options, updateOption))}
                        </Box>
                    );
				})}
			</Box>
        </Stack>
    );
}
