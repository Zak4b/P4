"use client";

import { Container, Box } from "@mui/material";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Box
			sx={{
				minHeight: "100vh",
				backgroundColor: "primary.main",
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

