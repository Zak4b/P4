"use client";

import type { ReactNode } from "react";
import { Box } from "@mui/material";
import { Card, CardHeader, CardContent, Heading } from "@/components/ui";
import { cardStyles, typographyStyles } from "@/lib/styles";

interface AuthCardProps {
	title: string;
	large?: boolean;
	children: ReactNode;
}

export default function AuthCard({ title, large = false, children }: AuthCardProps) {
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "60vh",
			}}
		>
			<Card sx={large ? cardStyles.authCardLarge : cardStyles.authCard}>
				<CardHeader sx={{ pb: 1 }}>
					<Heading level={5} sx={[{ fontWeight: 700 }, typographyStyles.gradientHeading]}>
						{title}
					</Heading>
				</CardHeader>
				<CardContent>{children}</CardContent>
			</Card>
		</Box>
	);
}
