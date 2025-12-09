"use client";

import { Container, Box, useTheme } from "@mui/material";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const theme = useTheme();
	return (
		<Box
			sx={{
				minHeight: "100vh",
				backgroundColor: theme.palette.primary.main,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				py: 4,
			}}
		>
			<Container maxWidth="sm">
				{children}
			</Container>
		</Box>
	);
}

