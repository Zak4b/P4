"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	Container,
	Box,
	Typography,
	Paper,
	Grid,
	Button,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Divider,
	Stack,
	TextField,
	InputAdornment,
} from "@mui/material";
import {
	PlayArrow,
	EmojiEvents,
	CheckCircleOutline,
	Search,
} from "@mui/icons-material";
import { colors } from "@/lib/styles";

export default function PlayIndexPage() {
	const router = useRouter();
	const [joinRoomId, setJoinRoomId] = useState("");

	const handleJoinSpecificRoom = (e: React.FormEvent) => {
		e.preventDefault();
		if (joinRoomId.trim()) {
			router.push(`/play/${joinRoomId.trim()}`);
		}
	};

	return (
		<Container maxWidth="lg" sx={{ py: 6 }}>
			<Grid container spacing={6}>
				{/* Left Column: Actions */}
				<Grid size={{ xs: 12, md: 5 }}>
					<Stack spacing={4}>
						<Box>
							<Typography
								variant="overline"
								fontWeight="bold"
								color="primary"
								sx={{ letterSpacing: 1.5 }}
							>
								GAME CENTER
							</Typography>
							<Typography variant="h2" fontWeight="800" gutterBottom>
								Ready to play?
							</Typography>
						</Box>

						<Stack spacing={2}>
							<Button
								component={Link}
								href="/play/1"
								variant="contained"
								size="large"
								startIcon={<PlayArrow />}
								sx={{
									py: 2,
									fontSize: "1.1rem",
									borderRadius: 3,
									textTransform: "none",
									fontWeight: "bold",
									backgroundColor: colors.primary,
									boxShadow: "0 8px 16px -4px rgba(99, 102, 241, 0.4)",
								}}
							>
								Quick Match (Room 1)
							</Button>
							
							<Paper
								component="form"
								onSubmit={handleJoinSpecificRoom}
								elevation={0}
								sx={{
									p: 0.5,
									display: "flex",
									alignItems: "center",
									border: "1px solid",
									borderColor: "divider",
									borderRadius: 3,
								}}
							>
								<TextField
									placeholder="Enter Room ID..."
									variant="standard"
									fullWidth
									value={joinRoomId}
									onChange={(e) => setJoinRoomId(e.target.value)}
									InputProps={{
										disableUnderline: true,
										startAdornment: (
											<InputAdornment position="start" sx={{ pl: 2 }}>
												<Search color="action" />
											</InputAdornment>
										),
									}}
									sx={{ px: 1 }}
								/>
								<Button
									type="submit"
									disabled={!joinRoomId.trim()}
									variant="contained"
									color="secondary"
									sx={{ 
										borderRadius: 2.5, 
										px: 3,
										textTransform: "none",
										fontWeight: "bold"
									}}
								>
									Join
								</Button>
							</Paper>
						</Stack>

						<Paper
							elevation={0}
							sx={{ p: 3, bgcolor: "primary.50", borderRadius: 4 }}
						>
							<Stack direction="row" spacing={2} alignItems="flex-start">
								<EmojiEvents color="primary" fontSize="large" />
								<Box>
									<Typography variant="h6" fontWeight="bold" gutterBottom>
										Daily Challenge
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Win 3 games in a row to unlock the "Strategist" badge and
										earn double points today!
									</Typography>
								</Box>
							</Stack>
						</Paper>
					</Stack>
				</Grid>

				{/* Right Column: Info & Rules */}
				<Grid size={{ xs: 12, md: 7 }}>
					<Stack spacing={4}>
						<Box>
							<Typography variant="h5" fontWeight="bold" gutterBottom>
								How to Play
							</Typography>
							<Paper variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden' }}>
								<List sx={{ py: 0 }}>
									<ListItem sx={{ py: 2 }}>
										<ListItemIcon>
											<CheckCircleOutline color="success" />
										</ListItemIcon>
										<ListItemText
											primary="The Objective"
											secondary="Connect 4 of your checkers in a row (horizontal, vertical, or diagonal) before your opponent."
											primaryTypographyProps={{ fontWeight: 'bold' }}
										/>
									</ListItem>
									<Divider component="li" />
									<ListItem sx={{ py: 2 }}>
										<ListItemIcon>
											<CheckCircleOutline color="success" />
										</ListItemIcon>
										<ListItemText
											primary="Taking Turns"
											secondary="Players take turns dropping one checker into any of the seven columns."
											primaryTypographyProps={{ fontWeight: 'bold' }}
										/>
									</ListItem>
								</List>
							</Paper>
						</Box>
					</Stack>
				</Grid>
			</Grid>
		</Container>
	);
}
