import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import GamePage from "./pages/Play";
import HistoryPage from "./pages/History";
import LoginPage from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./components/AuthContext";

function App() {
	return (
		<Router>
			<AuthProvider>
				<Layout>
					<Routes>
						<Route path="/login" element={<LoginPage />} />
						<Route
							path="/"
							element={
								<ProtectedRoute>
									<GamePage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/history"
							element={
								<ProtectedRoute>
									<HistoryPage />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</Layout>
			</AuthProvider>
		</Router>
	);
}

export default App;
