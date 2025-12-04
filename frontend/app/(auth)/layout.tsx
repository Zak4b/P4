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
				background: "linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%)",
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

