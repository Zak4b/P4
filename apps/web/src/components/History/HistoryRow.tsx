import { Box } from "@mui/material";
import { Text, Muted } from "@/components/ui";
import UserAvatar from "../UserAvatar";
import UserActionsDropdown from "../UserActionsDropdown";
import { formatDay, formatDuration, formatTime, type GameView, type Seat } from "./historyRowShared";

const TOKEN_VAR: Record<Seat, string> = {
	player1: "var(--mui-palette-board-player1)",
	player2: "var(--mui-palette-board-player2)",
};

function resultLabel(game: GameView, seat: Seat): string {
	if (!game.winner) {
		return "Nul";
	}
	return game.winner === seat ? "Victoire" : "Défaite";
}

/** Un côté de la partie : l'avatar cerclé de sa couleur, le nom, le résultat. */
function PlayerSide({ seat, game, currentUserId, selfLabel }: { seat: Seat; game: GameView; currentUserId?: string; selfLabel?: string }) {
	const person = game.match[seat];
	const won = game.winner === seat;
	const alignRight = seat === "player2";
	const label = resultLabel(game, seat);

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: alignRight ? "row-reverse" : "row",
				alignItems: "center",
				gap: { xs: 1, sm: 1.5 },
				minWidth: 0,
				p: { xs: 1, sm: 1.5 },
				borderRadius: "12px",
				// La moitié gagnante prend la teinte de son jeton.
				bgcolor: won ? `color-mix(in srgb, ${TOKEN_VAR[seat]} 16%, transparent)` : "transparent",
			}}
		>
			<UserActionsDropdown
				targetUser={{ id: person.id, username: person.username }}
				currentUserId={currentUserId}
			>
				<Box sx={{ p: "3px", borderRadius: "50%", bgcolor: TOKEN_VAR[seat], flex: "none", cursor: "pointer", lineHeight: 0 }}>
					<UserAvatar userId={person.id} username={person.username} size={44} sx={{ width: { xs: 36, sm: 44 }, height: { xs: 36, sm: 44 } }} />
				</Box>
			</UserActionsDropdown>
			<Box sx={{ minWidth: 0, textAlign: alignRight ? "right" : "left" }}>
				<Text
					sx={{
						fontWeight: won ? 700 : 500,
						fontSize: { xs: "0.9375rem", sm: "1.0625rem" },
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
					}}
				>
					{game.mySeat === seat && selfLabel ? selfLabel : person.username}
				</Text>
				<Box
					component="span"
					sx={{
						display: "inline-block",
						mt: 0.5,
						px: 1,
						py: "1px",
						borderRadius: 999,
						fontSize: "0.8125rem",
						fontWeight: 600,
						...(won
							? {
									bgcolor: TOKEN_VAR[seat],
									color: seat === "player1" ? "board.player1Contrast" : "board.player2Contrast",
								}
							: { bgcolor: "action.hover", color: "text.secondary" }),
					}}
				>
					{label}
				</Box>
			</Box>
		</Box>
	);
}

interface HistoryRowProps {
	game: GameView;
	currentUserId?: string;
	/** Nom affiché à la place du username du joueur suivi (« Toi » sur son propre profil). */
	selfLabel?: string;
}

/** Une partie : rouge à gauche, jaune à droite, la date et la durée au milieu. */
export default function HistoryRow({ game, currentUserId, selfLabel }: HistoryRowProps) {
	const { match } = game;
	return (
		<Box
			sx={{
				display: "grid",
				gridTemplateColumns: { xs: "minmax(0, 1fr) 64px minmax(0, 1fr)", sm: "minmax(0, 1fr) 140px minmax(0, 1fr)" },
				alignItems: "center",
				gap: { xs: 0.5, sm: 2 },
				p: { xs: 1, sm: 1.5 },
				bgcolor: "background.paper",
				border: "1px solid",
				borderColor: "divider",
				borderRadius: "16px",
			}}
		>
			<PlayerSide seat="player1" game={game} currentUserId={currentUserId} selfLabel={selfLabel} />
			<Box sx={{ textAlign: "center" }}>
				<Text sx={{ fontWeight: 600, fontSize: { xs: "0.8125rem", sm: "1rem" } }}>{formatDay(match.time)}</Text>
				<Muted sx={{ fontSize: "0.8125rem", fontVariantNumeric: "tabular-nums" }}>
					{formatTime(match.time)}
					<Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
						{" · "}
						{formatDuration(match.duration)}
					</Box>
				</Muted>
			</Box>
			<PlayerSide seat="player2" game={game} currentUserId={currentUserId} selfLabel={selfLabel} />
		</Box>
	);
}
