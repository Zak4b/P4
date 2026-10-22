import type { ReactNode } from "react";
import Box, { type BoxProps } from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { toSxArray } from "./toSxArray";

/**
 * Briques des écrans de l'app (jouer, historique, classement, profil).
 *
 * Règles communes : surfaces plates séparées par un liseré de 1 px, jamais
 * d'ombre ; la couleur va sur les données (les jetons), pas sur le cadre ;
 * les chiffres sont en chiffres tabulaires, alignés à droite.
 */

/** Surface de base : fond papier, liseré de 1 px, arrondi 16. */
export function Panel({ sx, ...props }: BoxProps) {
	return (
		<Box
			sx={[
				{
					bgcolor: "background.paper",
					border: "1px solid",
					borderColor: "divider",
					// En px : `shape.borderRadius` vaut 12, un nombre serait multiplié.
					borderRadius: "16px",
					overflow: "hidden",
				},
				...toSxArray(sx),
			]}
			{...props}
		/>
	);
}

/** En-tête d'un panneau : un titre nommant le bloc, une action facultative à droite. */
export function PanelHeader({ title, action }: { title: ReactNode; action?: ReactNode }) {
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				gap: 2,
				px: { xs: 2, sm: 3 },
				pt: 2.5,
				pb: 1.5,
				minHeight: 56,
			}}
		>
			<Typography component="h2" sx={{ fontSize: "1.0625rem", fontWeight: 600 }}>
				{title}
			</Typography>
			{action}
		</Box>
	);
}

interface PageHeaderProps {
	title: ReactNode;
	/** La phrase qui répond à la question de l'écran, lue juste après le titre. */
	finding?: ReactNode;
	action?: ReactNode;
}

/** Titre d'écran : un nom à 28 px, la phrase clé dessous, l'action principale à droite. */
export function PageHeader({ title, finding, action }: PageHeaderProps) {
	return (
		<Box
			data-motion=""
			sx={{
				display: "flex",
				alignItems: { xs: "flex-start", sm: "flex-end" },
				justifyContent: "space-between",
				flexDirection: { xs: "column", sm: "row" },
				gap: 2,
				mb: { xs: 3, md: 4 },
				animation: "riseIn 420ms var(--ease-out) both",
			}}
		>
			<Box sx={{ minWidth: 0 }}>
				<Typography
					component="h1"
					sx={{ fontSize: { xs: "1.5rem", md: "1.75rem" }, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15 }}
				>
					{title}
				</Typography>
				{finding && (
					<Typography sx={{ mt: 0.75, fontSize: "1rem", color: "text.secondary" }}>{finding}</Typography>
				)}
			</Box>
			{action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
		</Box>
	);
}

export interface Stat {
	label: string;
	value: ReactNode;
	/** Suffixe gris plus petit : « % », « s », « ELO ». */
	unit?: string;
	/** Jeton posé devant la valeur, pour les chiffres qui appartiennent à une couleur. */
	tone?: TokenTone;
}

/** Une seule boîte coupée par des liserés : le libellé au-dessus, la valeur dessous. */
export function StatStrip({ stats, sx }: { stats: Stat[]; sx?: BoxProps["sx"] }) {
	return (
		<Panel
			sx={[
				{
					display: "grid",
					gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: `repeat(${stats.length}, 1fr)` },
					// Les liserés internes : un fond « divider » visible dans les espaces de 1 px.
					gap: "1px",
					bgcolor: "divider",
				},
				...toSxArray(sx),
			]}
		>
			{stats.map((stat, i) => (
				<Box
					key={stat.label}
					sx={{
						bgcolor: "background.paper",
						px: { xs: 2, sm: 3 },
						py: 2,
						// Nombre impair sur téléphone : la dernière cellule prend toute la largeur.
						...(stats.length % 2 === 1 && i === stats.length - 1 && { gridColumn: { xs: "1 / -1", sm: "auto" } }),
					}}
				>
					<Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>{stat.label}</Typography>
					<Typography
						sx={{
							mt: 0.5,
							fontSize: "1.5rem",
							fontWeight: 500,
							fontVariantNumeric: "tabular-nums",
							lineHeight: 1.2,
							display: "flex",
							alignItems: "center",
							gap: 1,
						}}
					>
						{stat.tone && <Token tone={stat.tone} size={16} />}
						{stat.value}
						{stat.unit && (
							<Box component="span" sx={{ ml: 0.5, fontSize: "0.875rem", color: "text.secondary", fontWeight: 400 }}>
								{stat.unit}
							</Box>
						)}
					</Typography>
				</Box>
			))}
		</Panel>
	);
}

export type TokenTone = "player1" | "player2" | "win" | "loss" | "draw" | "gold" | "silver" | "bronze";

const TOKEN_FILL: Record<TokenTone, string> = {
	player1: "board.player1",
	player2: "board.player2",
	win: "primary.main",
	loss: "transparent",
	draw: "transparent",
	gold: "podium.gold",
	silver: "podium.silver",
	bronze: "podium.bronze",
};

/**
 * Le motif de l'app : un jeton. Sert de puce, de marque de résultat (plein pour
 * une victoire, vide pour une défaite, à moitié pour un nul) et de médaille.
 */
export function Token({ tone, size = 12, title }: { tone: TokenTone; size?: number; title?: string }) {
	const outlined = tone === "loss" || tone === "draw";
	return (
		<Box
			component="span"
			role={title ? "img" : undefined}
			aria-label={title}
			aria-hidden={title ? undefined : true}
			title={title}
			sx={{
				display: "inline-block",
				flex: "none",
				width: size,
				height: size,
				borderRadius: "50%",
				bgcolor: TOKEN_FILL[tone],
				border: outlined ? "2px solid" : "none",
				borderColor: outlined ? "text.secondary" : undefined,
				// Nul : un demi-jeton, la moitié basse pleine.
				backgroundImage:
					tone === "draw"
						? "linear-gradient(to top, var(--mui-palette-text-secondary) 50%, transparent 50%)"
						: undefined,
			}}
		/>
	);
}
