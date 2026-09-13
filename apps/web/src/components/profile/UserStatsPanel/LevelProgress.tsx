"use client";

import { Box } from "@mui/material";
import { Text, Muted } from "@/components/ui";
import type { LevelInfo } from "@p4/leveling";

interface LevelProgressProps {
	level: LevelInfo;
}

function XpBar({ level }: { level: LevelInfo }) {
	const progressPercent = (level.xpInCurrentLevel / level.xpRequiredForNextLevel) * 100;
	return (
		<Box
			sx={{
				flex: 1,
				minWidth: 0,
				height: 8,
				borderRadius: 1,
				overflow: "hidden",
				border: "1px solid",
				borderColor: "primary.main",
			}}
		>
			<Box
				sx={{
					height: "100%",
					width: `${progressPercent}%`,
					background: (theme) => theme.vars.palette.gradient.brand,
					borderRadius: 1,
				}}
			/>
		</Box>
	);
}

export function LevelProgress({ level }: LevelProgressProps) {
	return (
		<Box sx={{ px: 6, display: "flex", alignItems: "center", gap: 2 }}>
			<Text
				variant="subtitle1"
				sx={{
					fontWeight: 600,
					width: 90,
					flexShrink: 0,
				}}
			>
				Niveau {level.level}
			</Text>
			<XpBar level={level} />
			<Muted
				variant="caption"
				sx={{
					width: 70,
					flexShrink: 0,
					ml: "auto",
					textAlign: "right",
				}}
			>
				{level.xpInCurrentLevel}/{level.xpRequiredForNextLevel}
			</Muted>
		</Box>
	);
}
