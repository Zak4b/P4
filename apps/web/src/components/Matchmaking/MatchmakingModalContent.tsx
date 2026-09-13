"use client";

import { useEffect, useState } from "react";
import { CircularProgress, Stack } from "@mui/material";
import { Button, Heading, Muted } from "@/components/ui";
import { Cancel } from "@mui/icons-material";

function formatElapsed(seconds: number): string {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return `${m}:${s.toString().padStart(2, "0")}`;
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
		<Stack
			spacing={3}
			sx={{
				alignItems: "center",
			}}
		>
			<CircularProgress />
			<Muted>En attente d&apos;un adversaire...</Muted>
			<Heading
				level={5}
				color="primary"
				sx={{
					fontWeight: 700,
				}}
			>
				{formatElapsed(elapsed)}
			</Heading>
			<Button
				variant="outline"
				size="lg"
				startIcon={<Cancel />}
				onClick={onCancel}
				sx={{
					py: 2,
					px: 4,
					fontSize: "1.1rem",
					borderRadius: 3,
					textTransform: "none",
					fontWeight: "bold",
					borderColor: "primary.main",
					color: "primary.main",
					"&:hover": {
						borderColor: "primary.dark",
						backgroundColor: "rgba(99, 102, 241, 0.08)",
					},
				}}
			>
				Annuler
			</Button>
		</Stack>
	);
}
