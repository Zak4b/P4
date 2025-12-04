"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "@/components/AuthContext";
import Layout from "@/components/layout/Layout";

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isAuthenticated, isAuthReady } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (isAuthReady && !isAuthenticated) {
			router.replace("/login");
		}
	}, [isAuthenticated, isAuthReady, router]);

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
		return null;
	}

	return <Layout>{children}</Layout>;
}
