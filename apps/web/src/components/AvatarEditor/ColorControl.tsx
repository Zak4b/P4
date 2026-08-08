"use client";

import { useState } from "react";
import { Box, Typography, Popover, Stack, TextField, InputAdornment } from "@mui/material";
import { Colorize as ColorizeIcon } from "@mui/icons-material";
import { isHex } from "./utils";
import { TRANSPARENT_SWATCH } from "./constants";

interface ColorControlProps {
	label: string;
	colors: string[];
	value: string;
	onChange: (hex: string) => void;
}

export function ColorControl({ label, colors, value, onChange }: ColorControlProps) {
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const [customHex, setCustomHex] = useState(isHex(value) ? value : "ffffff");
	const isCustom = !colors.includes(value);

	// Le picker natif <input type="color"> déclenche onChange en continu pendant le drag :
	// on ne met à jour que l'aperçu local ici pour rester fluide, et on ne recalcule l'avatar
	// (onChange du parent, qui régénère tout le SVG) qu'au relâchement / à la perte de focus.
	const previewHex = (raw: string) => {
		setCustomHex(raw.replace(/^#/, "").toLowerCase());
	};

	const commitHex = (raw: string) => {
		const clean = raw.replace(/^#/, "").toLowerCase();
		setCustomHex(clean);
		if (isHex(clean)) onChange(clean);
	};

	return (
		<Box sx={{ mb: 2, minWidth: 0, overflow: "hidden" }}>
			<Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
				{label}
			</Typography>
			<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, maxWidth: "100%", alignItems: "center" }}>
				{colors.map((c) => (
					<Box
						key={c}
						onClick={() => onChange(c)}
						sx={{
							width: 28,
							height: 28,
							borderRadius: "50%",
							bgcolor: c === "transparent" ? "transparent" : `#${c}`,
							backgroundImage: c === "transparent" ? TRANSPARENT_SWATCH : undefined,
							backgroundSize: "8px 8px",
							backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0",
							border: "2px solid",
							borderColor: value === c ? "primary.main" : "divider",
							cursor: "pointer",
							"&:hover": { borderColor: "primary.light" },
						}}
						title={c}
					/>
				))}
				<Box
					component="button"
					type="button"
					onClick={(e) => setAnchorEl(e.currentTarget)}
					title="Couleur personnalisée"
					sx={{
						width: 28,
						height: 28,
						p: 0,
						borderRadius: "50%",
						border: "2px solid",
						borderColor: isCustom ? "primary.main" : "divider",
						bgcolor: isCustom && isHex(value) ? `#${value}` : "background.paper",
						cursor: "pointer",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: isCustom ? "primary.contrastText" : "text.secondary",
						"&:hover": { borderColor: "primary.light" },
					}}
				>
					<ColorizeIcon sx={{ fontSize: 14 }} />
				</Box>
			</Box>
			<Popover
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={() => {
					commitHex(customHex);
					setAnchorEl(null);
				}}
				anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
			>
				<Stack direction="row" spacing={1} sx={{ p: 1.5, alignItems: "center" }}>
					<Box
						component="input"
						type="color"
						value={`#${isHex(customHex) ? customHex : "ffffff"}`}
						onChange={(e) => previewHex(e.target.value)}
						onBlur={(e) => commitHex(e.target.value)}
						sx={{ width: 36, height: 36, border: "none", p: 0, cursor: "pointer", background: "none" }}
					/>
					<TextField
						size="small"
						value={customHex}
						onChange={(e) => commitHex(e.target.value)}
						error={customHex.length > 0 && !isHex(customHex)}
						slotProps={{ input: { startAdornment: <InputAdornment position="start">#</InputAdornment> } }}
						sx={{ width: 120 }}
					/>
				</Stack>
			</Popover>
		</Box>
	);
}
