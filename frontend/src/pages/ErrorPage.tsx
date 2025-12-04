import React from "react";
import { useRouteError, Link } from "react-router-dom";
import { Box, Typography, Button, Paper } from "@mui/material";
import { Home as HomeIcon, ErrorOutline as ErrorIcon } from "@mui/icons-material";

const ErrorPage: React.FC = () => {
	const error = useRouteError() as { status?: number; statusText?: string; message?: string };

	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			minHeight="80vh"
			sx={{
				background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
			}}
		>
			<Paper
				elevation={3}
				sx={{
					p: 6,
					textAlign: "center",
					maxWidth: 500,
					background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
				}}
			>
				<ErrorIcon sx={{ fontSize: 80, color: "#ef4444", mb: 2 }} />
				<Typography
					variant="h1"
					fontWeight={700}
					sx={{
						background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
						fontSize: { xs: "4rem", sm: "5rem" },
					}}
				>
					{error?.status || 404}
				</Typography>
				<Typography variant="h4" fontWeight={600} gutterBottom>
					Page not found
				</Typography>
				<Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
					{error?.statusText || error?.message || "The page you are looking for does not exist."}
				</Typography>
				<Button
					component={Link}
					to="/"
					variant="contained"
					size="large"
					startIcon={<HomeIcon />}
					sx={{
						background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
						"&:hover": {
							background: "linear-gradient(135deg, #4f46e5 0%, #db2777 100%)",
						},
					}}
				>
						Go to Home
				</Button>
			</Paper>
		</Box>
	);
};

export default ErrorPage;

