import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
	children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	const { isAuthenticated, isAuthReady } = useAuth();
	const location = useLocation();

	if (!isAuthReady) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
				<CircularProgress />
			</Box>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	return children;
};

export default ProtectedRoute;
