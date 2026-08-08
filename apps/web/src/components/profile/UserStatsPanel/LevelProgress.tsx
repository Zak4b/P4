"use client";

import { Box, Typography } from "@mui/material";
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
					background: "linear-gradient(90deg, #6366f1 0%, #ec4899 100%)",
					borderRadius: 1,
				}}
			/>
		</Box>
	);
}

export function LevelProgress({ level }: LevelProgressProps) {
	return (
		<Box sx={{ px: 6, display: "flex", alignItems: "center", gap: 2 }}>
			<Typography variant="subtitle1" fontWeight={600} sx={{ width: 90, flexShrink: 0 }}>
				Niveau {level.level}
			</Typography>
			<XpBar level={level} />
			<Typography
				variant="caption"
				color="text.secondary"
				sx={{ width: 70, flexShrink: 0, ml: "auto", textAlign: "right" }}
			>
				{level.xpInCurrentLevel}/{level.xpRequiredForNextLevel}
			</Typography>
		</Box>
	);
}
