"use client";

import { Box, Typography } from "@mui/material";
import { NONE, SWATCH_SIZE } from "./constants";

interface EnumControlProps {
	label: string;
	choices: string[];
	value: string;
	/** SVG de l'avatar avec ce choix appliqué, par valeur de choix (voir AvatarEditor.enumPreviews). */
	previews?: Record<string, string>;
	onChange: (value: string) => void;
}

const swatchSx = {
	width: SWATCH_SIZE,
	height: SWATCH_SIZE,
	p: 0,
	flexShrink: 0,
	borderRadius: 1.5,
	border: "2px solid",
	bgcolor: "action.hover",
	cursor: "pointer",
	overflow: "hidden",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	"&:hover": { borderColor: "primary.light" },
	"& svg": { width: "100%", height: "100%", display: "block" },
} as const;

export function EnumControl({ label, choices, value, previews, onChange }: EnumControlProps) {
	return (
		<Box sx={{ mb: 2, minWidth: 0, overflow: "hidden" }}>
			<Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
				{label}
			</Typography>
			<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, maxWidth: "100%" }}>
				{choices.map((opt) => {
					const svg = previews?.[opt];
					return (
						<Box
							key={opt}
							component="button"
							type="button"
							onClick={() => onChange(opt)}
							title={opt === NONE ? "Aucun" : opt}
							sx={{ ...swatchSx, borderColor: value === opt ? "primary.main" : "divider" }}
						>
							{/* previews est fourni par AvatarEditor pour chaque choix des contrôles à énumération ;
							le fallback texte ne sert qu'en l'absence de miniature (ex. rendu qui a échoué). */}
							{svg ? (
								<span style={{ width: "100%", height: "100%" }} dangerouslySetInnerHTML={{ __html: svg }} />
							) : (
								<Typography variant="caption" sx={{ px: 0.5, textAlign: "center", lineHeight: 1.1 }}>
									{opt === NONE ? "Aucun" : opt}
								</Typography>
							)}
						</Box>
					);
				})}
			</Box>
		</Box>
	);
}
