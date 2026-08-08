"use client";

import { Box, Typography, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { NONE } from "./constants";

interface EnumControlProps {
	label: string;
	choices: string[];
	value: string;
	onChange: (value: string) => void;
}

export function EnumControl({ label, choices, value, onChange }: EnumControlProps) {
	return (
		<Box sx={{ mb: 2, minWidth: 0, overflow: "hidden" }}>
			<Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
				{label}
			</Typography>
			<ToggleButtonGroup
				value={value}
				exclusive
				onChange={(_, v) => v != null && onChange(v)}
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
