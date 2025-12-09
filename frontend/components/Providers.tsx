"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./AuthContext";
import { WebSocketProvider } from "./WebSocketProvider";
import { useGameWebSocket } from "@/store/useGameStore";
import { theme } from "@/theme";

function GameWebSocketListener({ children }: { children: React.ReactNode }) {
	useGameWebSocket();
	return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AuthProvider>
				<WebSocketProvider>
					<GameWebSocketListener>
						{children}
					</GameWebSocketListener>
				</WebSocketProvider>
			</AuthProvider>
		</ThemeProvider>
	);
}

