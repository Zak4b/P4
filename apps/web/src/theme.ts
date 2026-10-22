import { createTheme } from "@mui/material/styles";

/**
 * Thème « Plateau ».
 *
 * La personnalité vient de l'objet lui-même : le bleu du cadre est la couleur de
 * marque, le rouge et le jaune des jetons sont les deux accents, et le jeton rond
 * est le seul motif (boutons en pastille, pastilles de liste, grands disques).
 * Aplats uniquement : pas de dégradé, pas d'ombre sur ce qui est au repos.
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

/** Métaux du podium : identiques dans les deux modes, comme de vraies médailles. Aplats. */
interface PodiumPalette {
	gold: string;
	silver: string;
	bronze: string;
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

/** Courbes partagées (voir aussi `custom.css`). */
export const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";

/** Couleurs de jeu : identiques dans les deux modes, ce sont celles du plateau physique. */
const TOKEN_RED = "#CE1D30";
const TOKEN_YELLOW = "#FDD334";
const TOKEN_ON_RED = "#ffffff";
const TOKEN_ON_YELLOW = "#2b2100";

const PODIUM: PodiumPalette = {
	gold: "#e8b923",
	silver: "#a9afb8",
	bronze: "#c27a3c",
};

export const theme = createTheme({
	cssVariables: {
		colorSchemeSelector: "data-mui-color-scheme",
	},
	colorSchemes: {
		light: {
			palette: {
				primary: {
					main: "#1f5bd8",
					light: "#4f82ea",
					dark: "#1746a8",
					contrastText: "#ffffff",
				},
				secondary: {
					main: "#fdd334",
					light: "#fee27a",
					dark: "#e0b400",
					contrastText: "#2b2100",
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
					default: "#f3f5fa",
					paper: "#ffffff",
				},
				text: {
					primary: "#0d1530",
					secondary: "#4d5875",
					disabled: "#94a3b8",
				},
				divider: "#dde3f0",
				board: {
					frame: "#1f5bd8",
					hole: "#f3f5fa",
					player1: TOKEN_RED,
					player2: TOKEN_YELLOW,
					player1Contrast: TOKEN_ON_RED,
					player2Contrast: TOKEN_ON_YELLOW,
				},
				gradient: {
					brand: "#1f5bd8",
					heading: "#0d1530",
					surface: "#ffffff",
				},
				tint: {
					primary: "rgba(31, 91, 216, 0.10)",
					secondary: "rgba(253, 211, 52, 0.22)",
					warning: "rgba(245, 158, 11, 0.10)",
					success: "rgba(16, 185, 129, 0.10)",
					hole: "rgba(13, 21, 48, 0.05)",
					holeRed: "rgba(206, 29, 48, 0.10)",
					holeYellow: "rgba(253, 211, 52, 0.16)",
					shine: "rgba(255, 255, 255, 0.4)",
				},
				shadow: {
					card: "none",
					board: "none",
					float: "0 2px 6px rgba(13, 21, 48, 0.08), 0 12px 28px -8px rgba(13, 21, 48, 0.22)",
				},
				podium: PODIUM,
				surfaceInverse: {
					main: "#0d1530",
					contrastText: "#e8f2f8",
					mutedText: "rgba(232, 242, 248, 0.7)",
				},
			},
		},
		dark: {
			palette: {
				primary: {
					main: "#5b8ef0",
					light: "#86acf5",
					dark: "#2f6be0",
					contrastText: "#06112b",
				},
				secondary: {
					main: "#fdd334",
					light: "#fee27a",
					dark: "#e0b400",
					contrastText: "#2b2100",
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
					default: "#0a1024",
					paper: "#121a33",
				},
				text: {
					primary: "#eef2fb",
					secondary: "#9aa6c4",
					disabled: "#5a6688",
				},
				divider: "#222c4a",
				board: {
					frame: "#1d4fbf",
					hole: "#0a1024",
					player1: TOKEN_RED,
					player2: TOKEN_YELLOW,
					player1Contrast: TOKEN_ON_RED,
					player2Contrast: TOKEN_ON_YELLOW,
				},
				gradient: {
					brand: "#5b8ef0",
					heading: "#eef2fb",
					surface: "#121a33",
				},
				tint: {
					primary: "rgba(91, 142, 240, 0.16)",
					secondary: "rgba(253, 211, 52, 0.16)",
					warning: "rgba(251, 191, 36, 0.16)",
					success: "rgba(52, 211, 153, 0.16)",
					hole: "rgba(238, 242, 251, 0.05)",
					holeRed: "rgba(206, 29, 48, 0.14)",
					holeYellow: "rgba(253, 211, 52, 0.14)",
					shine: "rgba(255, 255, 255, 0.25)",
				},
				shadow: {
					card: "none",
					board: "none",
					float: "0 12px 28px -12px rgba(0, 0, 0, 0.7)",
				},
				podium: PODIUM,
				surfaceInverse: {
					main: "#070c1c",
					contrastText: "#eef2fb",
					mutedText: "rgba(238, 242, 251, 0.7)",
				},
			},
		},
	},
	typography: {
		// Jost : géométrie ronde des années 1920, qui fait écho au jeton.
		// La variable est posée par `next/font` dans le layout racine.
		fontFamily: ["var(--font-jost)", '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
		h1: { fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 0.95 },
		h2: { fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1 },
		h3: { fontWeight: 700, letterSpacing: "-0.02em" },
		h4: { fontWeight: 700, letterSpacing: "-0.015em" },
		h5: { fontWeight: 600 },
		h6: { fontWeight: 600 },
		button: { fontWeight: 600, letterSpacing: 0 },
	},
	shape: {
		borderRadius: 12,
	},
	components: {
		MuiButtonBase: {
			styleOverrides: {
				// Tout ce qui se presse répond à la pression : c'est le « clac » du jeton.
				root: {
					transition: `transform 160ms ${EASE_OUT}`,
					"&:active:not(.Mui-disabled)": { transform: "scale(0.97)" },
				},
			},
		},
		MuiButton: {
			defaultProps: {
				disableElevation: true,
			},
			styleOverrides: {
				// Boutons en pastille : la forme du jeton, jamais l'arrondi « moyen ».
				root: {
					textTransform: "none",
					fontWeight: 600,
					borderRadius: 999,
					padding: "10px 24px",
					transition: `transform 160ms ${EASE_OUT}, background-color 200ms ease, border-color 200ms ease, color 200ms ease`,
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
		MuiPaper: {
			styleOverrides: {
				// Les surfaces au repos se séparent par un pas de ton, pas par une ombre.
				elevation: { boxShadow: "none" },
			},
		},
		MuiMenu: {
			styleOverrides: {
				// Un liseré en plus de l'ombre : sans lui, le haut du menu se perd sur le fond clair.
				paper: ({ theme }) => ({
					boxShadow: theme.vars.palette.shadow.float,
					border: `1px solid ${theme.vars.palette.divider}`,
					borderRadius: 12,
				}),
				list: { padding: 4 },
			},
		},
		MuiMenuItem: {
			styleOverrides: {
				root: {
					minHeight: 34,
					padding: "6px 10px",
					borderRadius: 8,
					fontSize: "0.9375rem",
					"& .MuiListItemIcon-root": { minWidth: 28 },
				},
			},
		},
		MuiPopover: {
			styleOverrides: {
				paper: ({ theme }) => ({ boxShadow: theme.vars.palette.shadow.float }),
			},
		},
		MuiDialog: {
			styleOverrides: {
				paper: ({ theme }) => ({ borderRadius: 24, boxShadow: theme.vars.palette.shadow.float }),
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
