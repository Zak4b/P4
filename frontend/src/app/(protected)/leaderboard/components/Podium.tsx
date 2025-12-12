"use client";

import {
	Box,
	Typography,
	Paper,
	Grid,
	Stack,
} from "@mui/material";
import {
	EmojiEvents as TrophyIcon,
	MilitaryTech as MedalIcon,
} from "@mui/icons-material";
import {
	paperStyles,
} from "@/lib/styles";
import UserAvatar from "@/components/UserAvatar";
import LeaderboardEntry, { LeaderboardPlayer } from "./LeaderboardEntry";

const configs = {
	 1:{
		height: { xs: "auto", sm: "320px" },
		background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
		border: "3px solid #ffd700",
		avatarSize: { xs: 50, sm: 100 },
		icon: <TrophyIcon sx={{ fontSize: { xs: 24, sm: 40 }, color: "#ff8c00" }} />,
		rankVariant: "h5" as const,
		eloVariant: "h4" as const,
		nameVariant: "h5" as const,
		elevation: 6,
	},
	2:{
		height: { xs: "auto", sm: "280px" },
		background: "linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%)",
		border: "none",
		avatarSize: { xs: 50, sm: 80 },
		icon: <MedalIcon sx={{ fontSize: { xs: 20, sm: 32 }, color: "#9e9e9e" }} />,
		rankVariant: "h6" as const,
		eloVariant: "h5" as const,
		nameVariant: "h6" as const,
		elevation: 4,
	},
	3:{
		height: { xs: "auto", sm: "260px" },
		background: "linear-gradient(135deg, #cd7f32 0%, #e6a85c 100%)",
		border: "none",
		avatarSize: { xs: 50, sm: 70 },
		icon: <MedalIcon sx={{ fontSize: { xs: 20, sm: 32 }, color: "#8b6914" }} />,
		rankVariant: "h6" as const,
		eloVariant: "h5" as const,
		nameVariant: "h6" as const,
		elevation: 4,
	},
};

const PodiumPlace = (
	position: 1 | 2 | 3,
	player: LeaderboardPlayer | undefined,
	order: { xs: number; sm: number }
) => {
	const config = configs[position];

	return (
		<Grid size={{ xs: 12, sm: 4 }} order={order} key={position}>
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
						opacity: player ? 1 : 0.5,
					},
				]}
			>
				<Box sx={{ position: "absolute", top: 8, right: 8 }}>
					{config.icon}
				</Box>
				<Box sx={{ mb: 2 }}>
					<Typography variant={config.rankVariant} fontWeight={700} color="text.secondary">
						#{position}
					</Typography>
				</Box>
				<UserAvatar
					login={player?.login ?? "Unknown"}
					sx={{ width: config.avatarSize, height: config.avatarSize, mx: "auto", mb: 2 }}
				/>
				<Typography variant={config.nameVariant} fontWeight={600} sx={{ mb: 1 }}>
					{player?.login ?? "Unknown"}
				</Typography>
				<Typography variant={config.eloVariant} fontWeight={700} color="primary">
					{player?.eloRating ?? "Unknown"}
				</Typography>
				<Typography variant={position === 1 ? "body1" : "body2"} color="text.secondary" fontWeight={position === 1 ? 600 : 400}>
					ELO
				</Typography>				
			</Paper>
		</Grid>
	);
};

const smallPodium = (player: LeaderboardPlayer, position: 1 | 2 | 3) => {
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
	)
}


interface PodiumProps {
	topThree: LeaderboardPlayer[]
}

export default function Podium({topThree}: PodiumProps){
	return (
		<>
			<Grid container spacing={2} justifyContent="center" alignItems="flex-end" sx={{ display: { xs: "none", sm: "flex" } }}>
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