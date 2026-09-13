"use client";

import type { ReactNode } from "react";
import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
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
				<CardHeader
					title={
						<Typography
							variant="h5"
							sx={[
								{
									fontWeight: 700,
								},
								typographyStyles.gradientHeading,
							]}
						>
							{title}
						</Typography>
					}
					sx={{ pb: 1 }}
				/>
				<CardContent>{children}</CardContent>
			</Card>
		</Box>
	);
}
