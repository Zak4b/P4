"use client";

import { Box } from "@mui/material";
import { Text, Muted } from "@/components/ui";
import type { LevelInfo } from "@p4/leveling";

interface LevelProgressProps {
	level: LevelInfo;
}

/** Progression vers le niveau suivant : une barre au vrai ratio, les deux bouts nommés. */
export function LevelProgress({ level }: LevelProgressProps) {
	const ratio = level.xpRequiredForNextLevel > 0 ? level.xpInCurrentLevel / level.xpRequiredForNextLevel : 0;
	return (
		<Box>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 1 }}>
				<Text sx={{ fontWeight: 600 }}>Niveau {level.level}</Text>
				<Muted sx={{ fontSize: "0.875rem", fontVariantNumeric: "tabular-nums" }}>
					{level.xpInCurrentLevel.toLocaleString("fr-FR")} / {level.xpRequiredForNextLevel.toLocaleString("fr-FR")} XP avant le niveau{" "}
					{level.level + 1}
				</Muted>
			</Box>
			<Box
				role="progressbar"
				aria-valuemin={0}
				aria-valuemax={level.xpRequiredForNextLevel}
				aria-valuenow={level.xpInCurrentLevel}
				sx={{ height: 10, borderRadius: 999, bgcolor: "action.hover", overflow: "hidden" }}
			>
				<Box
					sx={{
						height: "100%",
						width: "100%",
						borderRadius: 999,
						bgcolor: "primary.main",
						transformOrigin: "left",
						transform: `scaleX(${Math.min(1, ratio)})`,
						transition: "transform 600ms var(--ease-out)",
					}}
				/>
			</Box>
		</Box>
	);
}
