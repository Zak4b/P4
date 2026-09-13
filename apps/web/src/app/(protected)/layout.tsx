"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "@/components/AuthContext";
import Layout from "@/components/layout/Layout";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
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
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "100vh",
					backgroundColor: "primary.main",
				}}
			>
				<CircularProgress sx={{ color: "primary.contrastText" }} />
			</Box>
		);
	}

	if (!isAuthenticated) {
		return null;
	}

	return <Layout>{children}</Layout>;
}
