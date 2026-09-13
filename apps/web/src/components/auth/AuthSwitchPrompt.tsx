"use client";

import Link from "next/link";
import { Box } from "@mui/material";
import { Muted } from "@/components/ui";

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
			<Muted>
				{question}{" "}
				<Box component={Link} href={href} sx={{ color: "primary.main", fontWeight: 600, textDecoration: "none" }}>
					{linkLabel}
				</Box>
			</Muted>
		</Box>
	);
}
