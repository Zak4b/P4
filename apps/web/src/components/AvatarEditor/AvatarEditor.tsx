"use client";

import { useMemo, useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { Box, Stack, Tabs, Tab, Alert } from "@mui/material";
import { VISIBLE_GROUPS } from "./fieldGroups";
import { EDITOR_HEIGHT, PREVIEW_SIZE } from "./ui";
import { buildInitialOptions, getOptionsFromSeed, resolveAvatarOptions, type AvatarOptions } from "./avatarState";
import { renderAvatarSvg } from "./renderAvatar";
import { buildEnumPreviews } from "./avatarPreview";
import { getControlDescriptor } from "./controlProps";
import { saveAvatarOptions, formatSaveErrors } from "./avatarSave";
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

const AvatarEditor = forwardRef<AvatarEditorHandle, AvatarEditorProps>(function AvatarEditor(
	{ seed = "", onSavingChange },
	ref,
) {
	const [options, setOptions] = useState<AvatarOptions>(() =>
		seed ? getOptionsFromSeed(seed) : buildInitialOptions(),
	);

	const resolveOptions = useCallback(
		(overrides: Record<string, unknown> = {}) => resolveAvatarOptions(options, overrides),
		[options],
	);

	const renderSvg = useCallback(
		(overrides: Record<string, unknown>) => renderAvatarSvg(resolveOptions(overrides)),
		[resolveOptions],
	);

	const previewSvg = useMemo(() => renderSvg({ size: PREVIEW_SIZE }), [renderSvg]);

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
			await saveAvatarOptions(resolveOptions());
			setSaveSuccess(true);
		} catch (err) {
			setSaveErrors(formatSaveErrors(err));
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
	const enumPreviews = useMemo(
		() => buildEnumPreviews(currentGroup?.keys ?? [], renderSvg),
		[currentGroup, renderSvg],
	);

	const renderControl = (key: string) => {
		const descriptor = getControlDescriptor(key, options);
		if (!descriptor) return null;

		if (descriptor.type === "enum") {
			return (
				<EnumControl
					key={key}
					label={descriptor.label}
					choices={descriptor.choices}
					value={descriptor.value}
					previews={enumPreviews[key]}
					onChange={(v) => updateOption(key, [v])}
				/>
			);
		}

		return (
			<ColorControl
				key={key}
				label={descriptor.label}
				colors={descriptor.colors}
				value={descriptor.value}
				onChange={(hex) => updateOption(key, [hex])}
			/>
		);
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
