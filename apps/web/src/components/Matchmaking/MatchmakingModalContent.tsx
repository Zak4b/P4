"use client";

import { useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";
import { Button, Heading, Muted } from "@/components/ui";

function formatElapsed(seconds: number): string {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return `${m}:${s.toString().padStart(2, "0")}`;
}

/** L'attente dessinée avec le motif : rouge puis jaune tombent à tour de rôle. */
function WaitingTokens() {
	return (
		<Box role="progressbar" aria-label="Recherche d'un adversaire" sx={{ display: "flex", gap: 1.5, height: 56, alignItems: "flex-end" }}>
			{["board.player1", "board.player2"].map((color, i) => (
				<Box
					key={color}
					data-motion=""
					sx={{
						width: 28,
						height: 28,
						borderRadius: "50%",
						bgcolor: color,
						boxShadow: "inset 0 -3px 0 rgba(0,0,0,0.18)",
						"@keyframes waitDrop": {
							"0%, 100%": { transform: "translateY(0)" },
							"40%": { transform: "translateY(-24px)" },
						},
						animation: `waitDrop 1.2s var(--ease-in-out) ${i * 0.6}s infinite`,
					}}
				/>
			))}
		</Box>
	);
}

interface MatchmakingModalContentProps {
	onCancel: () => void;
}

export default function MatchmakingModalContent({ onCancel }: MatchmakingModalContentProps) {
	const [elapsed, setElapsed] = useState(0);

	useEffect(() => {
		const start = Date.now();
		const interval = setInterval(() => {
			setElapsed(Math.floor((Date.now() - start) / 1000));
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<Stack spacing={2.5} sx={{ alignItems: "center", py: 1 }}>
			<WaitingTokens />
			<Heading level={5} sx={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
				{formatElapsed(elapsed)}
			</Heading>
			<Muted>En attente d&apos;un adversaire…</Muted>
			<Button variant="outline" onClick={onCancel} sx={{ px: 4 }}>
				Annuler
			</Button>
		</Stack>
	);
}
