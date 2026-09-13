"use client";

import Link from "next/link";
import { Box, Typography } from "@mui/material";

interface AuthSwitchPromptProps {
	question: string;
	href: string;
	linkLabel: string;
}

export default function AuthSwitchPrompt({ question, href, linkLabel }: AuthSwitchPromptProps) {
	return (
		<Box
			sx={{
				textAlign: "center",
				mt: 2,
			}}
		>
			<Typography
				variant="body2"
				sx={{
					color: "text.secondary",
				}}
			>
				{question}{" "}
				<Box component={Link} href={href} sx={{ color: "primary.main", fontWeight: 600, textDecoration: "none" }}>
					{linkLabel}
				</Box>
			</Typography>
		</Box>
	);
}
