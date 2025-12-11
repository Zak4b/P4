import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
	interface Palette {
		gold: Palette['primary'];
	}

	interface PaletteOptions {
		gold?: PaletteOptions['primary'];
	}
}

declare module '@mui/material/SvgIcon' {
	interface SvgIconPropsColorOverrides {
		gold: true;
	}
}

export const theme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#6366f1', // Indigo vibrant
			light: '#818cf8',
			dark: '#4f46e5',
			contrastText: '#ffffff',
		},
		secondary: {
			main: '#ec4899', // Rose vif
			light: '#f472b6',
			dark: '#db2777',
			contrastText: '#ffffff',
		},
		success: {
			main: '#10b981', // Vert émeraude
			light: '#34d399',
			dark: '#059669',
		},
		warning: {
			main: '#f59e0b', // Orange ambre
			light: '#fbbf24',
			dark: '#d97706',
		},
		error: {
			main: '#ef4444', // Rouge vif
			light: '#f87171',
			dark: '#dc2626',
		},
		info: {
			main: '#3b82f6', // Bleu vif
			light: '#60a5fa',
			dark: '#2563eb',
		},
		gold: {
			main: '#ffd700', // Or
			light: '#ffed4e',
			dark: '#ccac00',
			contrastText: '#000000',
		},
		background: {
			default: '#f1f5f9',
			paper: '#ffffff',
		},
		text: {
			primary: '#1e293b',
			secondary: '#64748b',
		},
	},
	typography: {
		fontFamily: [
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
		].join(','),
		h1: {
			fontWeight: 700,
			color: '#1e293b',
		},
		h2: {
			fontWeight: 700,
			color: '#1e293b',
		},
		h3: {
			fontWeight: 600,
			color: '#1e293b',
		},
		h4: {
			fontWeight: 600,
			color: '#1e293b',
		},
		h5: {
			fontWeight: 600,
			color: '#1e293b',
		},
		h6: {
			fontWeight: 600,
			color: '#1e293b',
		},
	},
	shape: {
		borderRadius: 12,
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
					fontWeight: 600,
					borderRadius: 12,
					padding: '10px 24px',
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 16,
					boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				},
			},
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					'& .MuiOutlinedInput-root': {
						borderRadius: 12,
					},
				},
			},
		},
	},
});

