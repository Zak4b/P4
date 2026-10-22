"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import { Button, Muted, Panel, Text, Token, type TokenTone } from "@/components/ui";
import { useMatchQuery } from "@/lib/api/match/useMatchQuery";
import { useAuth } from "@/components/AuthContext";
import HistoryRow from "@/components/History/HistoryRow";
import { toGameView, type GameView } from "@/components/History/historyRowShared";

/** Parties affichées avant « Afficher plus ». */
const PAGE_SIZE = 10;
/** Jetons dans la bande de forme. */
const FORM_LENGTH = 10;

/** Le résultat d'une partie pour le joueur suivi : plein, vide ou à moitié. */
function formTone(game: GameView): TokenTone {
	if (!game.winner) {
		return "draw";
	}
	return game.winner === game.mySeat ? "win" : "loss";
}

function FormStrip({ games }: { games: GameView[] }) {
	return (
		<Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }} aria-label="Derniers résultats, du plus récent au plus ancien">
			{games.slice(0, FORM_LENGTH).map((g) => (
				<Token key={g.match.id} tone={formTone(g)} size={16} />
			))}
		</Box>
	);
}

function RowSkeleton() {
	return (
		<Box sx={{ display: "flex", alignItems: "center", gap: 2, px: 3, minHeight: 72 }}>
			<Box sx={{ width: 44, height: 44, borderRadius: "50%", bgcolor: "action.hover" }} />
			<Box sx={{ width: 160, height: 16, borderRadius: "4px", bgcolor: "action.hover" }} />
		</Box>
	);
}

/** Chargement, erreur et liste vide, dans un panneau qui garde sa place. */
function ListState({ isLoading, isError, onRetry }: { isLoading: boolean; isError: boolean; onRetry: () => void }) {
	if (isLoading) {
		return (
			<Panel>
				{[0, 1, 2].map((i) => (
					<RowSkeleton key={i} />
				))}
			</Panel>
		);
	}
	if (isError) {
		return (
			<Panel sx={{ px: 3, py: 3, display: "flex", alignItems: "center", gap: 2 }}>
				<Text>Impossible de charger les parties.</Text>
				<Button variant="ghost" size="sm" onClick={onRetry}>
					Réessayer
				</Button>
			</Panel>
		);
	}
	return (
		<Panel sx={{ px: 3, py: 4 }}>
			<Muted>Aucune partie jouée pour l&apos;instant.</Muted>
		</Panel>
	);
}

interface MatchHistoryPanelProps {
	userId: string;
}

/** Les parties du joueur dont on affiche le profil, de la plus récente à la plus ancienne. */
export default function MatchHistoryPanel({ userId }: MatchHistoryPanelProps) {
	const { user } = useAuth();
	const isOwn = user?.id === userId;
	const matchQuery = useMatchQuery(userId);
	const [showAll, setShowAll] = useState(false);

	const games = (matchQuery.data ?? []).map((m) => toGameView(m, userId)).sort((a, b) => b.match.time - a.match.time);
	const visible = showAll ? games : games.slice(0, PAGE_SIZE);

	const refresh = () => {
		matchQuery.refetch().catch((err: unknown) => console.error(err));
	};

	return (
		<Box component="section">
			<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 1.5, flexWrap: "wrap" }}>
				<Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
					<Typography component="h2" sx={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.01em" }}>
						Historique
					</Typography>
					{games.length > 0 && <FormStrip games={games} />}
				</Box>
				<Button variant="ghost" size="sm" startIcon={<RefreshIcon />} onClick={refresh} disabled={matchQuery.isFetching}>
					Actualiser
				</Button>
			</Box>

			{matchQuery.isSuccess && games.length > 0 ? (
				<Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
					{visible.map((game) => (
						<HistoryRow key={game.match.id} game={game} currentUserId={user?.id} selfLabel={isOwn ? "Toi" : undefined} />
					))}
					{games.length > PAGE_SIZE && (
						<Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
							<Button variant="outline" onClick={() => setShowAll((v) => !v)}>
								{showAll ? "Afficher moins" : `Afficher les ${games.length} parties`}
							</Button>
						</Box>
					)}
				</Box>
			) : (
				<ListState isLoading={matchQuery.isLoading} isError={matchQuery.isError} onRetry={refresh} />
			)}
		</Box>
	);
}
