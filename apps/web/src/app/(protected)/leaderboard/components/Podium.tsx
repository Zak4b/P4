"use client";

import { Box, Paper, Grid, Stack } from "@mui/material";
import { Text } from "@/components/ui";
import { EmojiEvents as TrophyIcon, MilitaryTech as MedalIcon } from "@mui/icons-material";
import { paperStyles } from "@/lib/styles";
import UserAvatar from "@/components/UserAvatar";
import LeaderboardEntry, { type LeaderboardPlayer } from "./LeaderboardEntry";

const configs = {
	1: {
		height: { xs: "auto", sm: "320px" },
		background: "var(--mui-palette-podium-gold)",
		border: "3px solid var(--mui-palette-podium-goldBorder)",
		avatarSize: { xs: 50, sm: 100 },
		icon: <TrophyIcon sx={{ fontSize: { xs: 24, sm: 40 }, color: "podium.goldIcon" }} />,
		rankVariant: "h5" as const,
		eloVariant: "h4" as const,
		nameVariant: "h5" as const,
		elevation: 6,
	},
	2: {
		height: { xs: "auto", sm: "280px" },
		background: "var(--mui-palette-podium-silver)",
		border: "none",
		avatarSize: { xs: 50, sm: 80 },
		icon: <MedalIcon sx={{ fontSize: { xs: 20, sm: 32 }, color: "podium.silverIcon" }} />,
		rankVariant: "h6" as const,
		eloVariant: "h5" as const,
		nameVariant: "h6" as const,
		elevation: 4,
	},
	3: {
		height: { xs: "auto", sm: "260px" },
		background: "var(--mui-palette-podium-bronze)",
		border: "none",
		avatarSize: { xs: 50, sm: 70 },
		icon: <MedalIcon sx={{ fontSize: { xs: 20, sm: 32 }, color: "podium.bronzeIcon" }} />,
		rankVariant: "h6" as const,
		eloVariant: "h5" as const,
		nameVariant: "h6" as const,
		elevation: 4,
	},
};

const PodiumPlace = (position: 1 | 2 | 3, player: LeaderboardPlayer | undefined, order: { xs: number; sm: number }) => {
	const config = configs[position];

	return (
		<Grid
			size={{ xs: 12, sm: 4 }}
			key={position}
			sx={{
				order: order,
			}}
		>
			<Paper
				elevation={config.elevation}
				sx={[
					paperStyles.gradientPaper,
					{
						textAlign: "center",
						p: 3,
						position: "relative",
						height: config.height,
						display: "flex",
						flexDirection: "column",
						justifyContent: "flex-end",
						background: config.background,
						border: config.border,
						color: "podium.ink",
						opacity: player ? 1 : 0.5,
					},
				]}
			>
				{player ? (
					<>
						<Box sx={{ position: "absolute", top: 8, right: 8 }}>{config.icon}</Box>
						<Box sx={{ mb: 2 }}>
							<Text
								variant={config.rankVariant}
								sx={{
									fontWeight: 700,
									color: "podium.inkMuted",
								}}
							>
								#{position}
							</Text>
						</Box>
						<UserAvatar
							userId={player?.id}
							login={player?.login}
							sx={{ width: config.avatarSize, height: config.avatarSize, mx: "auto", mb: 2 }}
						/>
						<Text
							variant={config.nameVariant}
							sx={{
								fontWeight: 600,
								mb: 1,
							}}
						>
							{player?.login ?? "Unknown"}
						</Text>
						<Text
							variant={config.eloVariant}
							sx={{
								fontWeight: 700,
								color: "podium.ink",
							}}
						>
							{player?.eloRating ?? "Unknown"}
						</Text>
						<Text
							variant={position === 1 ? "body1" : "body2"}
							sx={{
								color: "podium.inkMuted",
								fontWeight: position === 1 ? 600 : 400,
							}}
						>
							ELO
						</Text>
					</>
				) : null}
			</Paper>
		</Grid>
	);
};

const smallPodium = (player: LeaderboardPlayer | undefined, position: 1 | 2 | 3) => {
	const config = configs[position];
	return (
		<LeaderboardEntry
			player={player}
			rank={position}
			icon={config.icon}
			background={config.background}
			border={config.border}
			elevation={config.elevation}
			avatarSize={config.avatarSize.xs}
		/>
	);
};

interface PodiumProps {
	topThree: LeaderboardPlayer[];
}

export default function Podium({ topThree }: PodiumProps) {
	return (
		<>
			<Grid
				container
				spacing={2}
				sx={{
					justifyContent: "center",
					alignItems: "flex-end",
					display: { xs: "none", sm: "flex" },
				}}
			>
				{PodiumPlace(2, topThree[1], { xs: 1, sm: 1 })}
				{PodiumPlace(1, topThree[0], { xs: 2, sm: 2 })}
				{PodiumPlace(3, topThree[2], { xs: 3, sm: 3 })}
			</Grid>
			{/* Version horizontale pour petits écrans */}
			<Stack spacing={2} sx={{ display: { xs: "flex", sm: "none" } }}>
				{smallPodium(topThree[0], 1)}
				{smallPodium(topThree[1], 2)}
				{smallPodium(topThree[2], 3)}
			</Stack>
		</>
	);
}
