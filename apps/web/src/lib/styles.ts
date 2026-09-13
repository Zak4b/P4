import type { Theme } from "@mui/material/styles";

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
		color: "primary.main",
		display: "flex",
		alignItems: "center",
		gap: 1,
		fontWeight: 700,
	},

	gradientHeading: {
		color: "primary.main",
		fontWeight: 700,
	},
} as const;

const surface = (theme: Theme) => ({
	background: theme.vars.palette.gradient.surface,
});

// Paper/Card styles
export const paperStyles = {
	gradientPaper: (theme: Theme) => ({
		p: 4,
		...surface(theme),
	}),

	gradientCard: (theme: Theme) => surface(theme),

	gradientPaperLarge: (theme: Theme) => ({
		p: 6,
		textAlign: "center" as const,
		...surface(theme),
	}),
} as const;

// Button styles
export const buttonStyles = {
	gradientButton: {
		backgroundColor: "primary.main",
		color: "primary.contrastText",
		"&:hover": {
			backgroundColor: "primary.dark",
		},
	},

	gradientButtonDisabled: {
		backgroundColor: "primary.main",
		color: "primary.contrastText",
		"&:hover": {
			backgroundColor: "primary.dark",
		},
		"&.Mui-disabled": {
			backgroundColor: "action.disabledBackground",
			color: "action.disabled",
		},
	},

	primaryOutlined: {
		borderColor: "primary.main",
		color: "primary.main",
		"&:hover": {
			borderColor: "primary.dark",
			backgroundColor: "tint.primary",
		},
	},
} as const;

// TextField styles
export const textFieldStyles = {
	standard: {
		"& .MuiOutlinedInput-root": {
			borderRadius: 2,
			"& fieldset": {
				borderColor: "divider",
			},
			"&:hover fieldset": {
				borderColor: "primary.main",
			},
			"&.Mui-focused fieldset": {
				borderColor: "primary.main",
			},
		},
	},
} as const;

// AppBar styles
export const appBarStyles = {
	gradientAppBar: (theme: Theme) => ({
		backgroundColor: theme.vars.palette.primary.main,
		color: theme.vars.palette.primary.contrastText,
		boxShadow: theme.vars.palette.shadow.card,
	}),

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

// Divider styles
export const dividerStyles = {
	standard: {
		my: 2,
	},
} as const;

// Spacing utilities
export const spacing = {
	mb2: { mb: 2 },
	mt2: { mt: 2 },
} as const;

// Avatar styles
export const avatarStyles = {
	gradientAvatar: {
		backgroundColor: "primary.main",
	},

	large: {
		width: 100,
		height: 100,
		fontSize: "2.5rem",
		fontWeight: 700,
	},
} as const;

// Card styles
export const cardStyles = {
	authCard: (theme: Theme) => ({
		maxWidth: 450,
		width: "100%",
		...surface(theme),
	}),

	authCardLarge: (theme: Theme) => ({
		maxWidth: 500,
		width: "100%",
		...surface(theme),
	}),
} as const;
