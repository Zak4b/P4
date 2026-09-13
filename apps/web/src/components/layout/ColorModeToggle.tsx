"use client";

import { IconButton, Tooltip } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

/** Bascule clair / sombre. Le mode est mémorisé par MUI dans le localStorage. */
export default function ColorModeToggle() {
	const { mode, systemMode, setMode } = useColorScheme();

	// `mode` reste indéfini tant que l'hydratation n'a pas eu lieu : on réserve
	// la place du bouton pour que la barre ne saute pas au montage.
	const resolved = mode === "system" ? systemMode : mode;
	const isDark = resolved === "dark";

	return (
		<Tooltip title={isDark ? "Passer en clair" : "Passer en sombre"}>
			<IconButton
				color="inherit"
				aria-label={isDark ? "Passer en thème clair" : "Passer en thème sombre"}
				onClick={() => setMode(isDark ? "light" : "dark")}
				sx={{ visibility: mode ? "visible" : "hidden" }}
			>
				{isDark ? <LightModeIcon /> : <DarkModeIcon />}
			</IconButton>
		</Tooltip>
	);
}
