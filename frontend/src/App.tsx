import React from "react";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import { WebSocketProvider } from "./components/WebSocketProvider";
import { GameProvider } from "./components/GameContext";
import { routes } from "./routes";

function App() {
	return (
		<AuthProvider>
			<WebSocketProvider>
				<GameProvider>
					<RouterProvider router={routes} />
				</GameProvider>
			</WebSocketProvider>
		</AuthProvider>
	);
}

export default App;
