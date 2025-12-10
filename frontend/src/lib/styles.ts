import { createTheme, Theme } from "@mui/material/styles";

export const colors = {
	primary: "#6366f1",
	primaryHover: "#4f46e5",
	backgroundLight: "#f8fafc",
	backgroundWhite: "#ffffff",
	messageBg: "#e5e7eb",
	dark: "#1e293b",
	darkSecondary: "#334155",
	transparentPrimary: "rgba(99, 102, 241, 0.3)",
	transparentSecondary: "rgba(236, 72, 153, 0.2)",
	whiteOverlay: "rgba(255, 255, 255, 0.4)",
} as const;

export const theme: Theme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: colors.primary,
			dark: colors.primaryHover,
			contrastText: colors.backgroundWhite,
		},
		secondary: {
			main: "#ec4899",
			light: "#f472b6",
			dark: "#db2777",
			contrastText: colors.backgroundWhite,
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
			main: "#3b82f6",
			light: "#60a5fa",
			dark: "#2563eb",
		},
		background: {
			default: colors.backgroundLight,
			paper: colors.backgroundWhite,
		},
		text: {
			primary: colors.dark,
			secondary: colors.darkSecondary,
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
		h1: {
			fontWeight: 700,
			color: colors.dark,
		},
		h2: {
			fontWeight: 700,
			color: colors.dark,
		},
		h3: {
			fontWeight: 600,
			color: colors.dark,
		},
		h4: {
			fontWeight: 600,
			color: colors.dark,
		},
		h5: {
			fontWeight: 600,
			color: colors.dark,
		},
		h6: {
			fontWeight: 600,
			color: colors.dark,
		},
	},
	shape: {
		borderRadius: 12,
	},
});

// Gradients (only for backgrounds)
export const gradients = {
	background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
} as const;

// Layout styles
export const layoutStyles = {
	container: {
		maxWidth: "lg",
		py: 6,
	},

	flexCenter: {
		display: "flex",
		alignItems: "center",
		gap: 1,
	},

	flexCenterJustifyCenter: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		gap: 0.5,
	},

	flexEnd: {
		display: "flex",
		justifyContent: "flex-end",
	},
} as const;

// Typography styles
export const typographyStyles = {
	gradientTitle: {
		mb: 4,
		color: colors.primary,
		display: "flex",
		alignItems: "center",
		gap: 1,
		fontWeight: 700,
	},

	gradientHeading: {
		color: colors.primary,
		fontWeight: 700,
	},
} as const;

// Paper/Card styles
export const paperStyles = {
	gradientPaper: {
		p: 4,
		background: gradients.background,
	},

	gradientCard: {
		background: gradients.background,
	},

	gradientPaperLarge: {
		p: 6,
		textAlign: "center",
		background: gradients.background,
	},
} as const;

// Button styles
export const buttonStyles = {
	gradientButton: {
		backgroundColor: colors.primary,
		"&:hover": {
			backgroundColor: colors.primaryHover,
		},
	},

	gradientButtonDisabled: {
		backgroundColor: colors.primary,
		"&:hover": {
			backgroundColor: colors.primaryHover,
		},
		"&.Mui-disabled": {
			background: "grey.300",
		},
	},

	primaryOutlined: {
		borderColor: colors.primary,
		color: colors.primary,
		"&:hover": {
			borderColor: colors.primaryHover,
			background: "rgba(99, 102, 241, 0.1)",
		},
	},
} as const;

// TextField styles
export const textFieldStyles = {
	standard: {
		"& .MuiOutlinedInput-root": {
			borderRadius: 2,
			"& fieldset": {
				borderColor: "#e0e0e0",
			},
			"&:hover fieldset": {
				borderColor: "#6366f1",
			},
			"&.Mui-focused fieldset": {
				borderColor: "#6366f1",
			},
		},
	},
} as const;

// AppBar styles
export const appBarStyles = {
	gradientAppBar: {
		backgroundColor: colors.primary,
		boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
	},

	navButton: {
		bgcolor: "rgba(255, 255, 255, 0.2)",
		"&:hover": {
			bgcolor: "rgba(255, 255, 255, 0.15)",
		},
	},

	navButtonActive: {
		bgcolor: "rgba(255, 255, 255, 0.2)",
		"&:hover": {
			bgcolor: "rgba(255, 255, 255, 0.3)",
		},
	},
} as const;

// Table styles
export const tableStyles = {
	gradientHeader: {
		backgroundColor: colors.primary,
	},

	headerCell: {
		color: "white",
		fontWeight: 700,
		fontSize: "0.95rem",
		py: 2,
	},

	bodyRow: {
		"&:nth-of-type(odd)": {
			backgroundColor: "#f8fafc",
		},
		"&:hover": {
			backgroundColor: "#e2e8f0",
			transition: "background-color 0.2s ease-in-out",
		},
		transition: "background-color 0.2s ease-in-out",
	},

	bodyCell: {
		py: 2,
	},
} as const;

// Divider styles
export const dividerStyles = {
	standard: {
		my: 2,
	},
} as const;

// Spacing utilities
export const spacing = {
	mb2: { mb: 2 },
	mb3: { mb: 3 },
	mt2: { mt: 2 },
} as const;

// Avatar styles
export const avatarStyles = {
	gradientAvatar: {
		backgroundColor: colors.primary,
	},

	large: {
		width: 100,
		height: 100,
		fontSize: "2.5rem",
		fontWeight: 700,
	},
} as const;

// Chip styles
export const chipStyles = {
	standard: {
		fontWeight: 600,
		fontSize: "0.875rem",
		height: 32,
	},

	small: {
		fontWeight: 600,
	},
} as const;

// Card styles
export const cardStyles = {
	authCard: {
		maxWidth: 450,
		width: "100%",
		background: gradients.background,
	},

	authCardLarge: {
		maxWidth: 500,
		width: "100%",
		background: gradients.background,
	},
} as const;
