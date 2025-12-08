import React from "react";
import {
	Box,
	Paper,
	Typography,
	Avatar,
	Chip,
	Stack,
} from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";

interface Player {
	name: string;
	id: number;
}

interface PlayerIndicatorProps {
	players: Player[];
	activePlayerIndex: number;
}

const PlayerIndicator: React.FC<PlayerIndicatorProps> = ({ players, activePlayerIndex }) => {
	if (!players || players.length === 0) {
		return null;
	}

	if (activePlayerIndex < 0 || activePlayerIndex >= players.length) {
		return null;
	}

	return (
		<Paper
			elevation={4}
			sx={{
				mt: 3,
				p: 2.5,
				background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
				borderRadius: 3,
				overflow: "hidden",
			}}
		>
			<Stack direction="column" spacing={1.5}>
				{players.map((player, index) => {
					const isActive = index === activePlayerIndex;
					return (
						<Box
							key={player.id}
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1.5,
								p: 1.5,
								borderRadius: 2,
								bgcolor: isActive
									? player.id === 1
										? "rgba(239, 68, 68, 0.18)"
										: "rgba(245, 158, 11, 0.18)"
									: "rgba(255, 255, 255, 0.04)",
								border: isActive
									? `2px solid ${player.id === 1 ? "#ef4444" : "#f59e0b"}`
									: "1px solid rgba(255,255,255,0.08)",
								boxShadow: isActive
									? `0 0 16px ${player.id === 1 ? "rgba(239, 68, 68, 0.35)" : "rgba(245, 158, 11, 0.35)"}`
									: "none",
								transition: "all 0.25s ease",
							}}
						>
							<Avatar
								sx={{
									width: 48,
									height: 48,
									bgcolor: player.id === 1 ? "error.main" : "warning.main",
									border: isActive ? "3px solid white" : "2px solid rgba(255,255,255,0.35)",
									boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.35)" : "none",
								}}
							>
								<PersonIcon />
							</Avatar>
							<Box sx={{ flex: 1 }}>
								<Typography
									variant="subtitle1"
									sx={{ color: "white", fontWeight: isActive ? 700 : 600, lineHeight: 1.1 }}
								>
									{player.name}
								</Typography>
								<Typography
									variant="caption"
									sx={{ color: isActive ? "white" : "rgba(255,255,255,0.6)", fontWeight: 500 }}
								>
									{isActive ? "Au tour de ce joueur" : "En attente"}
								</Typography>
							</Box>
							{isActive && (
								<Chip
									label="Actif"
									size="small"
									sx={{
										bgcolor: player.id === 1 ? "error.dark" : "warning.dark",
										color: "white",
										fontWeight: 700,
										height: 22,
									}}
								/>
							)}
						</Box>
					);
				})}
			</Stack>
		</Paper>
	);
};

export default PlayerIndicator;

