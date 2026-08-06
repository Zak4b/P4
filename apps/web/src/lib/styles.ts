export const colors = {
	primary: "#6366f1",
	primaryHover: "#4f46e5",
	backgroundLight: "#f8fafc",
	messageBg: "#e5e7eb",
	dark: "#1e293b",
	transparentPrimary: "rgba(99, 102, 241, 0.3)",
	transparentSecondary: "rgba(236, 72, 153, 0.2)",
	whiteOverlay: "rgba(255, 255, 255, 0.4)",
} as const;

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
		backgroundColor: colors.primary,
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
