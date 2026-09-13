import { createTheme } from "@mui/material/styles";

/**
 * Thème « Ciel & sarcelle ».
 *
 * Les couleurs vivent toutes ici, en deux jeux (clair et sombre) exposés sous
 * forme de variables CSS. Dans un composant on lit un token — `primary.main`,
 * `board.frame`, `gradient.brand` — jamais une valeur hexadécimale : c'est ce
 * qui permet à la bascule de mode de fonctionner sans toucher au composant.
 */

interface BoardPalette {
	/** Cadre de la grille. */
	frame: string;
	/** Fond d'une case vide. */
	hole: string;
	/** Jeton du joueur 1. */
	player1: string;
	/** Jeton du joueur 2. */
	player2: string;
	/** Texte lisible posé sur un jeton. */
	player1Contrast: string;
	player2Contrast: string;
}

interface GradientPalette {
	/** Primaire vers accent : titres, barres de progression. */
	brand: string;
	/** Dégradé de texte pour les grands titres. */
	heading: string;
	/** Fond légèrement dégradé des cartes et panneaux. */
	surface: string;
}

interface TintPalette {
	/** Aplat primaire discret : survols, pastilles, carrés d'icônes. */
	primary: string;
	/** Aplat accent discret. */
	secondary: string;
	/** Aplats d'état, pour les survols de boutons contextuels. */
	warning: string;
	success: string;
	/** Motif de trous du fond de la page d'accueil. */
	hole: string;
	holeRed: string;
	holeYellow: string;
	/** Reflet posé sur un jeton. */
	shine: string;
}

/** Métaux du podium : identiques dans les deux modes, comme de vraies médailles. */
interface PodiumPalette {
	gold: string;
	goldBorder: string;
	goldIcon: string;
	silver: string;
	silverIcon: string;
	bronze: string;
	bronzeIcon: string;
	/** Texte posé sur un métal, toujours sombre. */
	ink: string;
	inkMuted: string;
}

interface ShadowPalette {
	card: string;
	board: string;
	float: string;
}

declare module "@mui/material/styles" {
	/** Active `cssVariables` côté types : `theme.vars` devient non optionnel. */
	interface CssThemeVariables {
		enabled: true;
	}

	interface Palette {
		gold: Palette["primary"];
		board: BoardPalette;
		gradient: GradientPalette;
		tint: TintPalette;
		shadow: ShadowPalette;
		podium: PodiumPalette;
		/** Panneau volontairement sombre dans les deux modes (bandeau des joueurs). */
		surfaceInverse: { main: string; contrastText: string; mutedText: string };
	}

	interface PaletteOptions {
		gold?: PaletteOptions["primary"];
		board?: BoardPalette;
		gradient?: GradientPalette;
		tint?: TintPalette;
		shadow?: ShadowPalette;
		podium?: PodiumPalette;
		surfaceInverse?: { main: string; contrastText: string; mutedText: string };
	}
}

declare module "@mui/material/SvgIcon" {
	interface SvgIconPropsColorOverrides {
		gold: true;
	}
}

/** Couleurs de jeu : identiques dans les deux modes, ce sont celles du plateau physique. */
const TOKEN_RED = "#CE1D30";
const TOKEN_YELLOW = "#FDD334";
const TOKEN_ON_RED = "#ffffff";
const TOKEN_ON_YELLOW = "#2b2100";

const PODIUM: PodiumPalette = {
	gold: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
	goldBorder: "#ffd700",
	goldIcon: "#ff8c00",
	silver: "linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%)",
	silverIcon: "#6f6f6f",
	bronze: "linear-gradient(135deg, #cd7f32 0%, #e6a85c 100%)",
	bronzeIcon: "#7a5a10",
	ink: "#1f1a05",
	inkMuted: "rgba(31, 26, 5, 0.68)",
};

export const theme = createTheme({
	cssVariables: {
		colorSchemeSelector: "data-mui-color-scheme",
	},
	colorSchemes: {
		light: {
			palette: {
				primary: {
					main: "#0369a1",
					light: "#0ea5e9",
					dark: "#075985",
					contrastText: "#ffffff",
				},
				secondary: {
					main: "#14b8a6",
					light: "#2dd4bf",
					dark: "#0f766e",
					contrastText: "#ffffff",
				},
				success: {
					main: "#10b981",
					light: "#34d399",
					dark: "#059669",
				},
				warning: {
					main: "#f59e0b",
					light: "#fbbf24",
					dark: "#d97706",
				},
				error: {
					main: "#ef4444",
					light: "#f87171",
					dark: "#dc2626",
				},
				info: {
					main: "#0891b2",
					light: "#22d3ee",
					dark: "#0e7490",
				},
				gold: {
					main: "#ffd700",
					light: "#ffed4e",
					dark: "#ccac00",
					contrastText: "#000000",
				},
				background: {
					default: "#f6f9fb",
					paper: "#ffffff",
				},
				text: {
					primary: "#0f172a",
					secondary: "#5b6b7c",
					disabled: "#94a3b8",
				},
				divider: "#dce7ef",
				board: {
					frame: "#9c9c9c",
					hole: "#f6f9fb",
					player1: TOKEN_RED,
					player2: TOKEN_YELLOW,
					player1Contrast: TOKEN_ON_RED,
					player2Contrast: TOKEN_ON_YELLOW,
				},
				gradient: {
					brand: "linear-gradient(135deg, #0369a1 0%, #14b8a6 100%)",
					heading: "linear-gradient(to right, #0f172a, #41556b)",
					surface: "linear-gradient(135deg, #ffffff 0%, #f6f9fb 100%)",
				},
				tint: {
					primary: "rgba(3, 105, 161, 0.10)",
					secondary: "rgba(20, 184, 166, 0.10)",
					warning: "rgba(245, 158, 11, 0.10)",
					success: "rgba(16, 185, 129, 0.10)",
					hole: "rgba(15, 23, 42, 0.05)",
					holeRed: "rgba(206, 29, 48, 0.10)",
					holeYellow: "rgba(253, 211, 52, 0.16)",
					shine: "rgba(255, 255, 255, 0.4)",
				},
				shadow: {
					card: "0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.06)",
					board: "0 25px 50px -12px rgba(15, 23, 42, 0.15)",
					float: "0 12px 28px -12px rgba(15, 23, 42, 0.28)",
				},
				podium: PODIUM,
				surfaceInverse: {
					main: "#0f2231",
					contrastText: "#e8f2f8",
					mutedText: "rgba(232, 242, 248, 0.7)",
				},
			},
		},
		dark: {
			palette: {
				primary: {
					main: "#0ea5e9",
					light: "#38bdf8",
					dark: "#0284c7",
					contrastText: "#052030",
				},
				secondary: {
					main: "#2dd4bf",
					light: "#5eead4",
					dark: "#14b8a6",
					contrastText: "#04211d",
				},
				success: {
					main: "#34d399",
					light: "#6ee7b7",
					dark: "#059669",
				},
				warning: {
					main: "#fbbf24",
					light: "#fcd34d",
					dark: "#d97706",
				},
				error: {
					main: "#f87171",
					light: "#fca5a5",
					dark: "#dc2626",
				},
				info: {
					main: "#22d3ee",
					light: "#67e8f9",
					dark: "#0891b2",
				},
				gold: {
					main: "#ffd700",
					light: "#ffed4e",
					dark: "#ccac00",
					contrastText: "#000000",
				},
				background: {
					default: "#0b1620",
					paper: "#12202c",
				},
				text: {
					primary: "#e8f2f8",
					secondary: "#8ea5b8",
					disabled: "#5c7285",
				},
				divider: "#1e3242",
				board: {
					frame: "#5c6570",
					hole: "#0b1620",
					player1: TOKEN_RED,
					player2: TOKEN_YELLOW,
					player1Contrast: TOKEN_ON_RED,
					player2Contrast: TOKEN_ON_YELLOW,
				},
				gradient: {
					brand: "linear-gradient(135deg, #0ea5e9 0%, #2dd4bf 100%)",
					heading: "linear-gradient(to right, #e8f2f8, #93aabd)",
					surface: "linear-gradient(135deg, #162836 0%, #12202c 100%)",
				},
				tint: {
					primary: "rgba(14, 165, 233, 0.16)",
					secondary: "rgba(45, 212, 191, 0.16)",
					warning: "rgba(251, 191, 36, 0.16)",
					success: "rgba(52, 211, 153, 0.16)",
					hole: "rgba(232, 242, 248, 0.05)",
					holeRed: "rgba(206, 29, 48, 0.14)",
					holeYellow: "rgba(253, 211, 52, 0.14)",
					shine: "rgba(255, 255, 255, 0.25)",
				},
				shadow: {
					card: "0 1px 2px rgba(0, 0, 0, 0.4), 0 8px 24px -12px rgba(0, 0, 0, 0.7)",
					board: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
					float: "0 12px 28px -12px rgba(0, 0, 0, 0.7)",
				},
				podium: PODIUM,
				surfaceInverse: {
					main: "#0a141c",
					contrastText: "#e8f2f8",
					mutedText: "rgba(232, 242, 248, 0.7)",
				},
			},
		},
	},
	typography: {
		fontFamily: [
			"-apple-system",
			"BlinkMacSystemFont",
			'"Segoe UI"',
			"Roboto",
			'"Helvetica Neue"',
			"Arial",
			"sans-serif",
		].join(","),
		h1: { fontWeight: 700 },
		h2: { fontWeight: 700 },
		h3: { fontWeight: 600 },
		h4: { fontWeight: 600 },
		h5: { fontWeight: 600 },
		h6: { fontWeight: 600 },
	},
	shape: {
		borderRadius: 12,
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: "none",
					fontWeight: 600,
					borderRadius: 12,
					padding: "10px 24px",
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: ({ theme }) => ({
					borderRadius: 16,
					boxShadow: theme.vars.palette.shadow.card,
				}),
			},
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					"& .MuiOutlinedInput-root": {
						borderRadius: 12,
					},
				},
			},
		},
	},
});
