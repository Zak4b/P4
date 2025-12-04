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
	active: boolean;
	name: string;
	id: number;
}

interface PlayerIndicatorProps {
	player1: Player;
	player2: Player;
}

const PlayerIndicator: React.FC<PlayerIndicatorProps> = ({ player1, player2 }) => {
	const activePlayer = player1.active ? player1 : player2;
	const inactivePlayer = player1.active ? player2 : player1;

	return (
		<Paper
			elevation={4}
			sx={{
				mt: 3,
				p: 2.5,
				background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
				borderRadius: 3,
				border: `3px solid ${player1.active ? "#ef4444" : "#f59e0b"}`,
				position: "relative",
				overflow: "hidden",
				"&::before": {
					content: '""',
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: "4px",
					background: `linear-gradient(90deg, ${player1.active ? "#ef4444" : "#f59e0b"} 0%, ${player1.active ? "#dc2626" : "#d97706"} 100%)`,
				},
			}}
		>
			<Stack 
				direction={{ xs: "column", sm: "row" }} 
				spacing={2} 
				alignItems="center" 
				justifyContent="space-between"
			>
				{/* Inactive Player */}
				<Box
					sx={{
						flex: { xs: 1, sm: 1 },
						display: "flex",
						alignItems: "center",
						gap: 1.5,
						opacity: 0.4,
						transition: "opacity 0.3s ease",
						width: { xs: "100%", sm: "auto" },
					}}
				>
					<Avatar
						sx={{
							width: 48,
							height: 48,
							bgcolor: inactivePlayer.id === 1 ? "error.dark" : "warning.dark",
							border: "2px solid rgba(255, 255, 255, 0.2)",
						}}
					>
						<PersonIcon />
					</Avatar>
					<Box>
						<Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: 500 }}>
							{inactivePlayer.name}
						</Typography>
						<Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
							En attente
						</Typography>
					</Box>
				</Box>

				{/* Active Player Indicator */}
				<Box
					sx={{
						flex: { xs: 1, sm: 1.5 },
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: 1,
						position: "relative",
						width: { xs: "100%", sm: "auto" },
					}}
				>
					<Box
						sx={{
							position: "absolute",
							top: -12,
							px: 2,
							py: 0.5,
							bgcolor: activePlayer.id === 1 ? "error.main" : "warning.main",
							borderRadius: 2,
							boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
						}}
					>
						<Typography variant="caption" sx={{ color: "white", fontWeight: 700, fontSize: "0.7rem" }}>
							AU TOUR DE
						</Typography>
					</Box>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 2,
							bgcolor: activePlayer.id === 1 ? "rgba(239, 68, 68, 0.2)" : "rgba(245, 158, 11, 0.2)",
							p: 2,
							borderRadius: 2,
							border: `2px solid ${activePlayer.id === 1 ? "#ef4444" : "#f59e0b"}`,
							boxShadow: `0 0 20px ${activePlayer.id === 1 ? "rgba(239, 68, 68, 0.5)" : "rgba(245, 158, 11, 0.5)"}`,
							transition: "all 0.3s ease",
							animation: "pulse 2s ease-in-out infinite",
							"@keyframes pulse": {
								"0%, 100%": {
									boxShadow: `0 0 20px ${activePlayer.id === 1 ? "rgba(239, 68, 68, 0.5)" : "rgba(245, 158, 11, 0.5)"}`,
								},
								"50%": {
									boxShadow: `0 0 30px ${activePlayer.id === 1 ? "rgba(239, 68, 68, 0.8)" : "rgba(245, 158, 11, 0.8)"}`,
								},
							},
						}}
					>
						<Avatar
							sx={{
								width: 56,
								height: 56,
								bgcolor: activePlayer.id === 1 ? "error.main" : "warning.main",
								border: "3px solid white",
								boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
							}}
						>
							<PersonIcon sx={{ fontSize: 32 }} />
						</Avatar>
						<Box>
							<Typography variant="h6" sx={{ color: "white", fontWeight: 700, mb: 0.5 }}>
								{activePlayer.name}
							</Typography>
							<Chip
								label="Joueur actif"
								size="small"
								sx={{
									bgcolor: activePlayer.id === 1 ? "error.dark" : "warning.dark",
									color: "white",
									fontWeight: 600,
									fontSize: "0.7rem",
									height: 20,
								}}
							/>
						</Box>
					</Box>
				</Box>

				{/* Placeholder for symmetry */}
				<Box sx={{ flex: { xs: 0, sm: 1 }, display: { xs: "none", sm: "block" } }} />
			</Stack>
		</Paper>
	);
};

export default PlayerIndicator;

