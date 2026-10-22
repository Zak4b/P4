"use client";

import { Box } from "@mui/material";
import { Panel } from "@/components/ui";

/** Chargement d'un panneau de profil : sa forme finale, valeurs remplacées par des barres grises. */
export function PanelLoading() {
	return (
		<Panel sx={{ height: "100%", p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
			<Box sx={{ width: 96, height: 18, borderRadius: "4px", bgcolor: "action.hover" }} />
			<Box sx={{ width: 160, height: 36, borderRadius: "4px", bgcolor: "action.hover" }} />
			<Box sx={{ width: "100%", height: 72, borderRadius: "8px", bgcolor: "action.hover" }} />
		</Panel>
	);
}
