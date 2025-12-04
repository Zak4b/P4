import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "./AuthContext";

const RequireAuth: React.FC = () => {
	const { isAuthenticated, isAuthReady } = useAuth();
	const location = useLocation();

	if (!isAuthReady) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight="100vh"
				sx={{
					background: "linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%)",
				}}
			>
				<CircularProgress sx={{ color: "white" }} />
			</Box>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	return <Outlet />;
};

export default RequireAuth;

