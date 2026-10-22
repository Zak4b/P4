import Link from "next/link";
import { Box, Stack } from "@mui/material";
import { Button, Heading, Text } from "@/components/ui";

import { DemoBoard } from "./DemoBoard";

/** Entrée décalée des éléments du héros : titre, phrase, action, puis le plateau. */
const rise = (delayMs: number) => ({
	animation: `riseIn 520ms var(--ease-out) ${delayMs}ms both`,
});

/**
 * Accueil « un seul motif » : le jeton rond, à l'échelle de l'écran.
 * Le fond est le bleu du cadre, un disque jaune géant entre par la droite,
 * et le vrai plateau s'y pose, jouable tout de suite.
 */
export default function HomeHero() {
	return (
		<Box
			component="main"
			sx={{
				position: "relative",
				minHeight: "100svh",
				overflow: "hidden",
				bgcolor: "board.frame",
				color: "common.white",
				display: "flex",
				flexDirection: "column",
			}}
		>
			{/* Le motif : un jeton jaune de 140vh, rogné par le bord droit. */}
			<Box
				aria-hidden
				data-motion=""
				sx={{
					position: "absolute",
					width: { xs: "150vw", md: "140vh" },
					height: { xs: "150vw", md: "140vh" },
					// Bord gauche calé sur le milieu : le titre reste sur le bleu.
					right: { xs: "-50vw", md: "auto" },
					left: { xs: "auto", md: "calc(50% - 24px)" },
					top: { xs: "auto", md: "-20vh" },
					bottom: { xs: "-90vw", md: "auto" },
					borderRadius: "50%",
					bgcolor: "board.player2",
					animation: "discIn 900ms var(--ease-out) both",
				}}
			/>

			<Box
				component="header"
				sx={{
					position: "relative",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					px: { xs: 2, md: 5 },
					pt: { xs: 2, md: 3 },
				}}
			>
				<Wordmark />
				{/* Même pastille que « Jouer », en plus discret : bleue sur le disque, blanche sur le bleu. */}
				<Button
					component={Link}
					href="/login"
					sx={{
						px: 3,
						fontSize: "1rem",
						bgcolor: { xs: "common.white", md: "board.frame" },
						color: { xs: "board.frame", md: "common.white" },
						"@media (hover: hover) and (pointer: fine)": {
							"&:hover": { bgcolor: { xs: "common.white", md: "primary.dark" } },
						},
					}}
				>
					Se connecter
				</Button>
			</Box>

			<Box
				sx={{
					position: "relative",
					flex: 1,
					display: "grid",
					gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
					alignItems: "center",
					gap: { xs: 6, md: 8 },
					px: { xs: 2, md: 5 },
					py: { xs: 6, md: 4 },
				}}
			>
				<Stack spacing={4}>
					<Heading
						level={1}
						data-motion=""
						sx={{
							textTransform: "uppercase",
							// « PUISSANCE 4 » fait environ 7 em de large : la taille suit la largeur
							// de sa colonne pour qu'il tienne sur une ligne. Mobile : l'écran moins
							// 2 × 16 px ; bureau : la demi-grille (50vw − 40 px de marge − 32 px de gouttière).
							fontSize: {
								xs: "min(3.5rem, calc((100vw - 32px) / 7.2))",
								sm: "4.5rem",
								md: "min(7rem, calc((50vw - 72px) / 7.2))",
							},
							lineHeight: 0.9,
							letterSpacing: "-0.03em",
							...rise(80),
						}}
					>
						Puissance 4
					</Heading>
					<Text
						data-motion=""
						sx={{ fontSize: { xs: "1.125rem", md: "1.375rem" }, lineHeight: 1.45, maxWidth: "34ch", ...rise(160) }}
					>
						Défie tes amis ou des inconnus en temps réel et grimpe au classement. Simple à apprendre, difficile
						à maîtriser.
					</Text>
					<Box data-motion="" sx={rise(240)}>
						<Button component={Link} href="/play" size="lg" variant="secondary" sx={{ px: 4.5, py: 1.75, fontSize: "1.125rem" }}>
							Jouer
						</Button>
					</Box>
				</Stack>

				{/* Le plateau est posé sur le disque : il se joue directement. */}
				<Box
					data-motion=""
					sx={{
						justifySelf: { xs: "stretch", md: "center" },
						width: { xs: "100%", md: "min(100%, 520px)" },
						color: "board.player2Contrast",
						// Légère inclinaison, comme un plateau posé sur la table. `rotate` est
						// indépendant de `transform` : l'animation d'entrée ne l'écrase pas.
						// Droit sur mobile, où les coins seraient rognés par l'écran.
						rotate: { xs: "0deg", md: "4deg" },
						...rise(320),
					}}
				>
					<DemoBoard />
				</Box>
			</Box>
		</Box>
	);
}

/** « P4 » suivi de ses deux jetons : rouge puis jaune, l'ordre du premier coup. */
function Wordmark() {
	return (
		<Box
			component={Link}
			href="/"
			sx={{ display: "flex", alignItems: "center", gap: 1, color: "inherit", textDecoration: "none" }}
		>
			<Text component="span" sx={{ fontWeight: 700, fontSize: "1.5rem", letterSpacing: "-0.02em" }}>
				P4
			</Text>
			<Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: "board.player1" }} />
			<Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: "board.player2" }} />
		</Box>
	);
}
