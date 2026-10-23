import Link from "next/link";
import { Box } from "@mui/material";
import { Text } from "@/components/ui";

const LEGAL_LINKS = [
	{ href: "/mentions-legales", label: "Mentions légales" },
	{ href: "/confidentialite", label: "Confidentialité" },
] as const;

interface FooterProps {
	tone?: "default" | "brand";
}

export default function Footer({ tone = "default" }: FooterProps) {
	const isBrand = tone === "brand";

	return (
		<Box
			component="footer"
			sx={{
				position: "relative",
				display: "flex",
				flexWrap: "wrap",
				alignItems: "center",
				justifyContent: "space-between",
				gap: 1.5,
				px: { xs: 2, md: 5 },
				py: 2,
				bgcolor: isBrand ? "board.frame" : "transparent",
				color: isBrand ? "common.white" : "text.secondary",
				borderTop: isBrand ? "none" : 1,
				borderColor: "divider",
			}}
		>
			<Text size="md" component="span" sx={{ color: "inherit" }}>
				© {new Date().getFullYear()} P4
			</Text>
			<Box
				component="nav"
				aria-label="Informations légales"
				sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 2, md: 3 } }}
			>
				{LEGAL_LINKS.map(({ href, label }) => (
					<Box
						key={href}
						component={Link}
						href={href}
						sx={{
							typography: "body2",
							color: "inherit",
							textDecoration: "none",
							"&:hover": { textDecoration: "underline" },
							"&:focus-visible": { textDecoration: "underline" },
						}}
					>
						{label}
					</Box>
				))}
			</Box>
		</Box>
	);
}
