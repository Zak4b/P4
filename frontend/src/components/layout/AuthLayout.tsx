import React from "react";
import { Outlet } from "react-router-dom";
import { Container, Box } from "@mui/material";

const AuthLayout: React.FC = () => {
	return (
		<Box
			sx={{
				minHeight: "100vh",
				background: "linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				py: 4,
			}}
		>
			<Container maxWidth="sm">
			<Outlet />
			</Container>
		</Box>
	);
};

export default AuthLayout;

