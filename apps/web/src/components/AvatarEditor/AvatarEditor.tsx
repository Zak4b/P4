"use client";

import { useMemo, useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { Box, Stack, Tabs, Tab, Alert } from "@mui/material";
import { createAvatar } from "@dicebear/core";
import { micahStyle } from "@/lib/avatar";
import {
	avatarSchemaProperties,
	propertyLabels,
	getEnumOptions,
	getColorOptions,
	isColorField,
	type AvatarSchemaProperty,
} from "./avatarOptions";
import { apiClient, ApiError } from "@/lib/api";
import type { AvatarOptions as AvatarSaveOptions } from "@p4/schemas/avatar";
import { EDITOR_GROUPS, EDITOR_HEIGHT, NONE, OPTIONAL_COMPONENTS, PREVIEW_SIZE, SWATCH_SIZE } from "./constants";
import { buildInitialOptions, getOptionsFromSeed, type AvatarOptions } from "./utils";
import { EnumControl } from "./EnumControl";
import { ColorControl } from "./ColorControl";

export interface AvatarEditorProps {
	seed?: string;
	/** Reflète l'état d'enregistrement en cours vers le parent (ex. pour désactiver le bouton "Enregistrer" du Dialog). */
	onSavingChange?: (saving: boolean) => void;
}

export interface AvatarEditorHandle {
	save: () => void;
}

// EDITOR_GROUPS et avatarSchemaProperties sont tous deux figés au chargement du module :
// pas besoin de recalculer ça par instance, encore moins de le mémoïser dans le composant.
const VISIBLE_GROUPS = EDITOR_GROUPS.map((group) => ({
	...group,
	keys: group.keys.filter((k) => avatarSchemaProperties[k]),
})).filter((group) => group.keys.length > 0);

// Un composant optionnel (hair, glasses...) propose "Aucun(e)" en plus de ses variantes.
const getChoices = (key: string, enumOpts: string[]): string[] =>
	OPTIONAL_COMPONENTS.includes(key) ? [NONE, ...enumOpts] : enumOpts;

const AvatarEditor = forwardRef<AvatarEditorHandle, AvatarEditorProps>(function AvatarEditor(
	{ seed = "", onSavingChange },
	ref,
) {
	const [options, setOptions] = useState<AvatarOptions>(() =>
		seed ? getOptionsFromSeed(seed) : buildInitialOptions(),
	);

	const resolveOptions = useCallback(
		(overrides: Record<string, unknown> = {}): Record<string, unknown> => {
			const opts: Record<string, unknown> = { ...options, ...overrides };
			const first = (arr: unknown) => (Array.isArray(arr) ? arr[0] : undefined);

			for (const key of OPTIONAL_COMPONENTS) {
				const probKey = `${key}Probability`;
				opts[probKey] = first(opts[key]) === NONE ? 0 : 100;
			}
			return opts;
		},
		[options],
	);

	const renderAvatarSvg = useCallback(
		(overrides: Record<string, unknown>) =>
			createAvatar(micahStyle, resolveOptions(overrides) as Record<string, string | number>).toString(),
		[resolveOptions],
	);

	const previewSvg = useMemo(() => renderAvatarSvg({ size: PREVIEW_SIZE }), [renderAvatarSvg]);

	const updateOption = useCallback((key: string, value: string | number | boolean | string[] | number[]) => {
		setOptions((prev) => ({ ...prev, [key]: value }));
	}, []);

	const [saveErrors, setSaveErrors] = useState<string[] | null>(null);
	const [saveSuccess, setSaveSuccess] = useState(false);

	const handleSave = useCallback(async () => {
		onSavingChange?.(true);
		setSaveErrors(null);
		setSaveSuccess(false);
		try {
			// "size" est un paramètre de rendu de la preview, pas une caractéristique de l'avatar :
			const { size: _size, ...persisted } = resolveOptions();
			await apiClient.saveAvatar(persisted as AvatarSaveOptions);
			setSaveSuccess(true);
		} catch (err) {
			if (err instanceof ApiError && err.issues?.length) {
				setSaveErrors(err.issues.map((issue) => `${issue.path || "options"} : ${issue.message}`));
			} else {
				setSaveErrors([err instanceof Error ? err.message : "Erreur inconnue lors de l'enregistrement"]);
			}
		} finally {
			onSavingChange?.(false);
		}
	}, [resolveOptions, onSavingChange]);

	useImperativeHandle(ref, () => ({ save: handleSave }), [handleSave]);

	const [activeGroup, setActiveGroup] = useState(0);
	const currentGroup = VISIBLE_GROUPS[Math.min(activeGroup, VISIBLE_GROUPS.length - 1)];

	// Une miniature par choix, pour les contrôles à énumération du groupe affiché : on ne calcule
	// que ce qui est visible (pas les autres onglets) et on recalcule quand les options changent,
	// puisque les miniatures reflètent le reste de l'avatar actuel (couleurs, autres composants...).
	const enumPreviews = useMemo(() => {
		const previewsByKey: Record<string, Record<string, string>> = {};
		for (const key of currentGroup?.keys ?? []) {
			const prop = avatarSchemaProperties[key] as AvatarSchemaProperty | undefined;
			const enumOpts = getEnumOptions(prop);
			if (!enumOpts) continue;

			const previews: Record<string, string> = {};
			for (const choice of getChoices(key, enumOpts)) {
				previews[choice] = renderAvatarSvg({ [key]: [choice], size: SWATCH_SIZE });
			}
			previewsByKey[key] = previews;
		}
		return previewsByKey;
	}, [currentGroup, renderAvatarSvg]);

	const renderControl = (key: string) => {
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
			return (
				<EnumControl
					key={key}
					label={label}
					choices={choices}
					value={value ?? choices[0]}
					previews={enumPreviews[key]}
					onChange={(v) => updateOption(key, [v])}
				/>
			);
		}

		if (isColorField(prop)) {
			const colors = getColorOptions(prop);
			const current = (options[key] as string[]) ?? colors;
			const value = Array.isArray(current) ? current[0] : current;
			return (
				<ColorControl
					key={key}
					label={label}
					colors={colors}
					value={value ?? colors[0] ?? "000000"}
					onChange={(hex) => updateOption(key, [hex])}
				/>
			);
		}

		return null;
	};

	return (
		<Stack
			direction={{ xs: "column", md: "row" }}
			spacing={4}
			sx={{ p: 2, height: EDITOR_HEIGHT, width: "100%", overflow: "hidden" }}
		>
			<Box sx={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
				<Box
					role="img"
					aria-label="Avatar"
					dangerouslySetInnerHTML={{ __html: previewSvg }}
					sx={{
						width: PREVIEW_SIZE,
						height: PREVIEW_SIZE,
						borderRadius: 2,
						bgcolor: "action.hover",
						boxShadow: 2,
						overflow: "hidden",
						"& svg": { width: "100%", height: "100%", display: "block" },
					}}
				/>
				{saveSuccess && (
					<Alert severity="success" sx={{ mt: 1.5, width: PREVIEW_SIZE }}>
						Avatar enregistré
					</Alert>
				)}
				{saveErrors && (
					<Alert severity="error" sx={{ mt: 1.5, width: PREVIEW_SIZE }}>
						{saveErrors.map((message) => (
							<Box key={message}>{message}</Box>
						))}
					</Alert>
				)}
			</Box>
			<Box sx={{ flex: 1, minWidth: 0, maxWidth: "100%", minHeight: 0, display: "flex", flexDirection: "column" }}>
				<Tabs
					value={currentGroup ? VISIBLE_GROUPS.indexOf(currentGroup) : 0}
					onChange={(_, v) => setActiveGroup(v)}
					variant="scrollable"
					scrollButtons="auto"
					sx={{ minHeight: 40, borderBottom: 1, borderColor: "divider", mb: 2, flexShrink: 0 }}
				>
					{VISIBLE_GROUPS.map((group) => (
						<Tab key={group.title} label={group.title} sx={{ minHeight: 40, py: 1 }} />
					))}
				</Tabs>
				<Box sx={{ flex: 1, minWidth: 0, minHeight: 0, overflowY: "auto", overflowX: "hidden", px: 0.5 }}>
					{currentGroup?.keys.map(renderControl)}
				</Box>
			</Box>
		</Stack>
	);
});

export default AvatarEditor;
