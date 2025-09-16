import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import GamePage from "./pages/Play";
import HistoryPage from "./pages/History";
import { AuthProvider } from "./components/AuthContext";

function App() {
	return (
		<Router>
			<AuthProvider>
				<Layout>
					<Routes>
						<Route path="/" element={<GamePage />} />
						<Route path="/history" element={<HistoryPage />} />
					</Routes>
				</Layout>
			</AuthProvider>
		</Router>
	);
}

export default App;
