"use client";

import type { ReactNode } from "react";
import { Box, Stack } from "@mui/material";
import { Heading, Muted, Text } from "@/components/ui";

interface LegalPageProps {
	title: string;
	updatedAt: string;
	children: ReactNode;
}

export function LegalPage({ title, updatedAt, children }: LegalPageProps) {
	return (
		<Box component="article" sx={{ maxWidth: "70ch", mx: "auto", py: { xs: 4, md: 6 } }}>
			<Heading level={1} sx={{ fontSize: { xs: "2.25rem", md: "3rem" } }}>
				{title}
			</Heading>
			<Muted sx={{ mt: 1.5 }}>Dernière mise à jour : {updatedAt}</Muted>
			<Stack spacing={5} sx={{ mt: 5 }}>
				{children}
			</Stack>
		</Box>
	);
}

export function LegalSection({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
	return (
		<Box component="section" id={id} sx={{ scrollMarginTop: 96 }}>
			<Heading level={2} sx={{ fontSize: { xs: "1.375rem", md: "1.625rem" }, mb: 2 }}>
				{title}
			</Heading>
			<Stack spacing={1.5}>{children}</Stack>
		</Box>
	);
}

const proseSx = {
	lineHeight: 1.65,
	"& a": { color: "primary.main", textDecoration: "underline", textUnderlineOffset: "2px" },
} as const;

export function P({ children }: { children: ReactNode }) {
	return <Text sx={proseSx}>{children}</Text>;
}

/** Champ que l'éditeur doit renseigner avant la mise en ligne. */
export function Todo({ children }: { children: ReactNode }) {
	return (
		<Box
			component="mark"
			sx={{
				px: 0.5,
				borderRadius: 0.5,
				bgcolor: "warning.light",
				color: "warning.contrastText",
				fontWeight: 600,
			}}
		>
			[À COMPLÉTER : {children}]
		</Box>
	);
}
