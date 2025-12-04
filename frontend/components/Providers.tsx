"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./AuthContext";
import { WebSocketProvider } from "./WebSocketProvider";
import { GameProvider } from "./GameContext";
import { theme } from "@/theme";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AuthProvider>
				<WebSocketProvider>
					<GameProvider>
						{children}
					</GameProvider>
				</WebSocketProvider>
			</AuthProvider>
		</ThemeProvider>
	);
}

