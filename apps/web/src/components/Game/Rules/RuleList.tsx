import { Box } from "@mui/material";
import { Panel, PanelHeader, Text, Muted, Token } from "@/components/ui";

const rules = [
	{
		title: "Aligne quatre jetons",
		description: "Aligne 4 jetons de ta couleur, à l'horizontale, à la verticale ou en diagonale, avant ton adversaire.",
	},
	{
		title: "Chacun son tour",
		description: "Rouge commence. À chaque tour, lâche un jeton dans l'une des sept colonnes.",
	},
	{
		title: "La gravité décide",
		description: "Un jeton tombe dans la case libre la plus basse de sa colonne. Une colonne pleine est fermée.",
	},
	{
		title: "Plateau plein, match nul",
		description: "Quand les 42 cases sont remplies sans alignement de quatre, la partie est nulle.",
	},
] as const;

type Cell = 0 | 1;

/** Les quatre façons de gagner, chacune sur une grille 4 × 4. */
const WINS: { label: string; cells: Cell[] }[] = [
	{ label: "Horizontale", cells: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1] },
	{ label: "Verticale", cells: [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0] },
	{ label: "Diagonale", cells: [0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0] },
	{ label: "Autre diagonale", cells: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
];

function WinPattern({ label, cells, color }: { label: string; cells: Cell[]; color: string }) {
	return (
		<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
			<Box
				role="img"
				aria-label={`Victoire en ${label.toLowerCase()}`}
				sx={{
					display: "grid",
					gridTemplateColumns: "repeat(4, 1fr)",
					gap: "3px",
					p: "5px",
					bgcolor: "board.frame",
					borderRadius: "8px",
					width: { xs: 64, sm: 76 },
				}}
			>
				{cells.map((cell, i) => (
					<Box
						key={i}
						sx={{
							aspectRatio: 1,
							borderRadius: "50%",
							bgcolor: cell ? color : "board.hole",
						}}
					/>
				))}
			</Box>
		</Box>
	);
}

/** Règles du jeu, avec les quatre alignements gagnants dessinés en jetons. */
export default function RuleList() {
	return (
		<Panel>
			<PanelHeader title="Règles du jeu" />
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "repeat(4, 1fr)",
					justifyItems: "center",
					gap: 1,
					px: { xs: 2, sm: 3 },
					pb: 2,
				}}
			>
				{WINS.map((win, i) => (
					<WinPattern key={win.label} {...win} color={i % 2 === 0 ? "board.player1" : "board.player2"} />
				))}
			</Box>
			<Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
				{rules.map((rule, i) => (
					<Box
						component="li"
						key={rule.title}
						sx={{
							display: "flex",
							gap: 2,
							px: { xs: 2, sm: 3 },
							py: 2,
							borderTop: "1px solid",
							borderColor: "divider",
						}}
					>
						<Box sx={{ pt: "6px" }}>
							<Token tone={i % 2 === 0 ? "player1" : "player2"} size={12} />
						</Box>
						<Box>
							<Text sx={{ fontWeight: 600 }}>{rule.title}</Text>
							<Muted sx={{ mt: 0.25 }}>{rule.description}</Muted>
						</Box>
					</Box>
				))}
			</Box>
		</Panel>
	);
}
