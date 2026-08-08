"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./AuthContext";
import { WebSocketProvider } from "./WebSocketProvider";
import { QueryProvider } from "./QueryProvider";
import { useGameWebSocket } from "@/store/game";
import { theme } from "@/theme";

function GameWebSocketListener({ children }: { children: React.ReactNode }) {
	useGameWebSocket();
	return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<QueryProvider>
				<AuthProvider>
					<WebSocketProvider>
						<GameWebSocketListener>
							{children}
						</GameWebSocketListener>
					</WebSocketProvider>
				</AuthProvider>
			</QueryProvider>
		</ThemeProvider>
	);
}

