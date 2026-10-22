"use client";

import { Box, Container } from "@mui/material";
import { PageHeader } from "@/components/ui";
import RuleList from "@/components/Game/Rules/RuleList";
import { useMatching } from "@/hooks/useMatching";
import PlayActionsPanel from "./components/PlayActionsPanel";

export default function PlayIndexPage() {
	const { modal, startMatchmaking } = useMatching();

	return (
		<Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
			<PageHeader title="Jouer" finding="Affronte le prochain joueur en attente, ou rejoins la partie d'un ami." />
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", md: "5fr 7fr" },
					gap: 3,
					alignItems: "start",
				}}
			>
				<Box data-motion="" sx={{ animation: "riseIn 420ms var(--ease-out) 60ms both" }}>
					<PlayActionsPanel onQuickMatch={startMatchmaking} />
				</Box>
				<Box data-motion="" sx={{ animation: "riseIn 420ms var(--ease-out) 120ms both" }}>
					<RuleList />
				</Box>
			</Box>
			{modal}
		</Container>
	);
}
