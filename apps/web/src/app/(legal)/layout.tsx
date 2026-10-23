"use client";

import Link from "next/link";
import { Box, Container } from "@mui/material";
import { Text } from "@/components/ui";
import Footer from "@/components/layout/Footer";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
	return (
		<Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
			<Box
				component="header"
				sx={{ px: { xs: 2, md: 5 }, py: { xs: 2, md: 3 }, borderBottom: 1, borderColor: "divider" }}
			>
				<Box
					component={Link}
					href="/"
					sx={{ display: "inline-flex", alignItems: "center", gap: 1, color: "text.primary", textDecoration: "none" }}
				>
					<Text component="span" sx={{ fontWeight: 700, fontSize: "1.5rem", letterSpacing: "-0.02em" }}>
						P4
					</Text>
					<Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: "board.player1" }} />
					<Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: "board.player2" }} />
				</Box>
			</Box>
			<Container maxWidth="md" sx={{ flex: 1, px: { xs: 2, md: 4 } }}>
				{children}
			</Container>
			<Footer />
		</Box>
	);
}
