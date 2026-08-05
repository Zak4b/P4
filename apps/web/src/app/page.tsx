"use client";

import Link from "next/link";
import { Box, Button, Typography, Container, Stack, Paper, Grid } from "@mui/material";
import { PlayArrow as PlayIcon, Bolt, Group } from "@mui/icons-material";
import { colors } from "@/lib/styles";

const STATS = [
	{ value: "1k+", label: "Players", color: "primary.main" },
	{ value: "500+", label: "Games/day", color: "secondary.main" },
	{ value: "4.9", label: "Rating", color: "#fbbf24" },
];

const BOARD_STATE = [
	0, 0, 0, 0, 0, 0, 0, // Row 0 (Top)
	0, 0, 0, 0, 0, 0, 0, // Row 1
	0, 0, 0, 1, 0, 0, 0, // Row 2
	0, 0, 2, 2, 0, 0, 0, // Row 3
	0, 2, 1, 1, 1, 0, 0, // Row 4
	2, 1, 2, 1, 2, 1, 2, // Row 5 (Bottom)
];

export default function HomePage() {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				minHeight: "100vh",
				position: "relative",
				overflow: "hidden",
			}}
		>
			{/* Background Elements */}
			<Box
				sx={{
					position: "absolute",
					top: -100,
					right: -100,
					width: 400,
					height: 400,
					borderRadius: "50%",
					background: colors.transparentPrimary,
					filter: "blur(80px)",
					zIndex: 0,
				}}
			/>
			<Box
				sx={{
					position: "absolute",
					bottom: -50,
					left: -50,
					width: 300,
					height: 300,
					borderRadius: "50%",
					background: colors.transparentSecondary,
					filter: "blur(60px)",
					zIndex: 0,
				}}
			/>

			<Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: 8 }}>
				<Grid container spacing={6} alignItems="center">
					<Grid size={{ xs: 12, md: 6 }}>
						<Stack spacing={4}>
							<Box>
								<Typography
									variant="overline"
									sx={{
										fontWeight: 700,
										letterSpacing: 2,
										background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
										backgroundClip: "text",
										WebkitBackgroundClip: "text",
										color: "transparent",
										mb: 2,
										display: "block",
									}}
								>
									CONNECT 4 ONLINE
								</Typography>
								<Typography
									variant="h1"
									sx={{
										fontWeight: 900,
										fontSize: { xs: "3rem", md: "4.5rem" },
										lineHeight: 1.1,
										mb: 2,
										background: "linear-gradient(to right, #1e293b, #475569)",
										backgroundClip: "text",
										WebkitBackgroundClip: "text",
										color: "transparent",
									}}
								>
									Master <br />
									<Box component="span" sx={{ color: "#6366f1" }}>
										the grid.
									</Box>
								</Typography>
								<Typography variant="h5" color="text.secondary" sx={{ maxWidth: 500, lineHeight: 1.6 }}>
									Challenge friends or players worldwide in the ultimate classic strategy game. Simple to learn, hard to master.
								</Typography>
							</Box>

							<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
								<Button
									component={Link}
									href="/play"
									variant="contained"
									size="large"
									startIcon={<PlayIcon />}
									sx={{
										px: 4,
										py: 1.5,
										fontSize: "1.1rem",
										fontWeight: 700,
										borderRadius: 3,
										backgroundColor: colors.primary,
										boxShadow: "0 10px 20px -5px rgba(99, 102, 241, 0.4)",
										transition: "all 0.3s ease",
										"&:hover": {
											backgroundColor: colors.primaryHover,
											transform: "translateY(-2px)",
											boxShadow: "0 15px 25px -5px rgba(99, 102, 241, 0.5)",
										},
									}}
								>
									Play Now
								</Button>
							</Stack>

							<Stack direction="row" spacing={4} sx={{ pt: 2 }}>
								{STATS.map((stat, index) => (
									<Box key={index}>
										<Typography variant="h4" fontWeight={800} sx={{ color: stat.color }}>
											{stat.value}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											{stat.label}
										</Typography>
									</Box>
								))}
							</Stack>
						</Stack>
					</Grid>

					<Grid size={{ xs: 12, md: 6 }}>
						<Box
							sx={{
								position: "relative",
								height: 500,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							{/* Floating Cards */}
							<Paper
								elevation={4}
								sx={{
									position: "absolute",
									top: 40,
									right: 40,
									p: 2,
									borderRadius: 4,
									display: "flex",
									alignItems: "center",
									gap: 2,
									animation: "float 6s ease-in-out infinite",
									"@keyframes float": {
										"0%, 100%": { transform: "translateY(0)" },
										"50%": { transform: "translateY(-20px)" },
									},
								}}
							>
								<Box
									sx={{
										width: 48,
										height: 48,
										borderRadius: 3,
										bgcolor: "rgba(99, 102, 241, 0.1)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: "primary.main",
									}}
								>
									<Bolt fontSize="large" />
								</Box>
								<Box>
									<Typography variant="subtitle2" fontWeight={700}>
										Fast
									</Typography>
									<Typography variant="caption" color="text.secondary">
										Real-time
									</Typography>
								</Box>
							</Paper>

							<Paper
								elevation={4}
								sx={{
									position: "absolute",
									bottom: 80,
									left: 20,
									p: 2,
									borderRadius: 4,
									display: "flex",
									alignItems: "center",
									gap: 2,
									animation: "float 7s ease-in-out infinite 1s",
									zIndex: 2,
								}}
							>
								<Box
									sx={{
										width: 48,
										height: 48,
										borderRadius: 3,
										bgcolor: "rgba(236, 72, 153, 0.1)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: "secondary.main",
									}}
								>
									<Group fontSize="large" />
								</Box>
								<Box>
									<Typography variant="subtitle2" fontWeight={700}>
										Multiplayer
									</Typography>
									<Typography variant="caption" color="text.secondary">
										Invite friends
									</Typography>
								</Box>
							</Paper>

							{/* Abstract Game Board Representation */}
							<Box
								sx={{
									width: 350,
									height: "auto",
									aspectRatio: "7/6",
									bgcolor: "white",
									borderRadius: 4,
									boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
									p: 2,
									display: "grid",
									gridTemplateColumns: "repeat(7, 1fr)",
									gap: 1.5,
									transform: "rotate(-6deg)",
									transition: "transform 0.3s ease",
									"&:hover": {
										transform: "rotate(0deg) scale(1.02)",
									},
								}}
							>
								{BOARD_STATE.map((cell, i) => (
									<Box
										key={i}
										sx={{
											width: "100%",
											paddingTop: "100%",
											borderRadius: "50%",
											bgcolor:
												cell === 1
													? "#ef4444" // Red
													: cell === 2
													? "#eab308" // Yellow
													: "#f1f5f9", // Empty
											position: "relative",
											overflow: "hidden",
											boxShadow:
												cell !== 0
													? "inset 0 -4px 6px rgba(0,0,0,0.2), 0 4px 6px rgba(0,0,0,0.1)"
													: "inset 0 4px 6px rgba(0,0,0,0.1)", // Inner shadow for empty cells
											"&::after":
												// Add shine effect for chips
												cell !== 0
													? {
															content: '""',
															position: "absolute",
															top: "10%",
															left: "10%",
															width: "40%",
															height: "40%",
															borderRadius: "50%",
															background: colors.whiteOverlay,
													  }
													: {},
										}}
									/>
								))}
							</Box>
						</Box>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
}

