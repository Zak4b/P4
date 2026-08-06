"use client";

import { useEffect, useState } from "react";
import {
	Box,
	Typography,
	Paper,
	CircularProgress,
	Alert,
	Grid,
	Stack,
	Divider,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Container,
} from "@mui/material";
import {
	Person as PersonIcon,
	Email as EmailIcon,
	Badge as BadgeIcon,
} from "@mui/icons-material";
import { useAuth } from "@/components/AuthContext";
import { apiClient, UserStats } from "@/lib/api";
import { typographyStyles, paperStyles, avatarStyles, layoutStyles } from "@/lib/styles";
import UserAvatar from "@/components/UserAvatar";
import UserStatsPanel from "@/components/UserStatsPanel";
import AvatarEditor from "@/components/AvatarEditor";

export default function ProfilePage() {
	const { user } = useAuth();
	const [stats, setStats] = useState<UserStats | null>(null);
	const [avatarModalOpen, setAvatarModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!user) return;

		const loadData = async () => {
			setIsLoading(true);
			setError("");
			try {
				const stats = await apiClient.getUserStats(user.id);
				setStats(stats);
			} catch (err) {
				setError("Failed to load account data: " + err);
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, [user]);

	if (isLoading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return <Alert severity="error">{error}</Alert>;
	}

	if (!user) {
		return <Alert severity="warning">User information not available</Alert>;
	}

	return (
		<Container maxWidth="lg" sx={layoutStyles.container}>
			<Typography variant="h4" fontWeight={700} sx={typographyStyles.gradientTitle}>
				<PersonIcon />
				Mon compte
			</Typography>

			<Grid container spacing={3}>
				{/* Informations utilisateur */}
				<Grid size={{ xs: 12, md: 6 }}>
					<Paper elevation={3} sx={[paperStyles.gradientPaper, { p: 3, height: "100%" }]}>
						<Stack spacing={3} alignItems="center">
							<Box
								component="button"
								onClick={() => setAvatarModalOpen(true)}
								sx={{
									cursor: "pointer",
									border: "none",
									padding: 0,
									background: "none",
									"&:hover": { opacity: 0.9 },
								}}
								aria-label="Modifier l'avatar"
							>
								<UserAvatar
									login={user.login}
									sx={{ ...avatarStyles.large, ...avatarStyles.gradientAvatar }}
								/>
							</Box>
							<Box sx={{ width: "100%" }}>
								<Stack spacing={2}>
									<Box sx={layoutStyles.flexCenter}>
										<PersonIcon color="primary" />
										<Typography variant="h6" fontWeight={600}>
											{user.login}
										</Typography>
									</Box>
									<Divider />
									<Box sx={layoutStyles.flexCenter}>
										<EmailIcon color="primary" />
										<Typography variant="body1" color="text.secondary">
											{user.email}
										</Typography>
									</Box>
									<Box sx={layoutStyles.flexCenter}>
										<BadgeIcon color="primary" />
										<Typography variant="body2" color="text.secondary">
											ID: {user.id}
										</Typography>
									</Box>
								</Stack>
							</Box>
						</Stack>
					</Paper>
				</Grid>

				{/* Statistiques */}
				<Grid size={{ xs: 12, md: 6 }}>
					<UserStatsPanel stats={stats} />
				</Grid>
			</Grid>

			<Dialog
				open={avatarModalOpen}
				onClose={() => setAvatarModalOpen(false)}
				maxWidth="md"
				fullWidth
				PaperProps={{
					sx: { maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" },
				}}
			>
				<DialogTitle sx={{ flexShrink: 0 }}>Personnaliser l&apos;avatar</DialogTitle>
				<DialogContent sx={{ overflow: "hidden", flex: 1, minHeight: 0, display: "flex", p: 0 }}>
					<AvatarEditor seed={user.login} />
				</DialogContent>
				<DialogActions sx={{ flexShrink: 0 }}>
					<Button onClick={() => setAvatarModalOpen(false)} variant="contained">
						Fermer
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
}
