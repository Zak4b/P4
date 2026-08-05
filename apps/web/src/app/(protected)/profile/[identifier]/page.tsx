"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
	Box,
	Typography,
	Paper,
	CircularProgress,
	Alert,
	Grid,
	Stack,
	Container,
} from "@mui/material";
import {
	Person as PersonIcon,
	EmojiEvents as TrophyIcon,
	SportsEsports as GameIcon,
	TrendingUp as WinIcon,
	TrendingDown as LossIcon,
	Remove as DrawIcon,
} from "@mui/icons-material";
import { apiClient, UserProfile } from "@/lib/api";
import {
	typographyStyles,
	paperStyles,
	avatarStyles,
	layoutStyles,
	dividerStyles,
} from "@/lib/styles";
import UserAvatar from "@/components/UserAvatar";
import FriendControls, { FriendStatus } from "@/components/FriendControls";
import { useAuth } from "@/components/AuthContext";

export default function PublicProfilePage() {
	const params = useParams();
	const { user: currentUser } = useAuth();
	const identifier = (params?.identifier as string) ?? "";
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [friendStatus, setFriendStatus] = useState<FriendStatus>("none");
	const [friendStatusLoading, setFriendStatusLoading] = useState(false);

	useEffect(() => {
		if (!identifier) {
			setIsLoading(false);
			setError("Joueur introuvable");
			return;
		}

		const loadData = async () => {
			setIsLoading(true);
			setError("");
			try {
				const data = await apiClient.getProfile(identifier);
				setProfile(data);
			} catch {
				setError("Joueur introuvable");
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, [identifier]);

	useEffect(() => {
		if (!profile || !currentUser || profile.id === currentUser.id) return;

		const loadFriendStatus = async () => {
			setFriendStatusLoading(true);
			try {
				const { status } = await apiClient.getFriendStatus(identifier);
				setFriendStatus(status);
			} catch {
				setFriendStatus("none");
			} finally {
				setFriendStatusLoading(false);
			}
		};

		loadFriendStatus();
	}, [profile, currentUser, identifier]);

	const isOwnProfile = currentUser && profile && profile.id === currentUser.id;

	const winrate = useMemo(() => {
		return profile && profile.totalGames > 0
			? Math.round((profile.wins / profile.totalGames) * 100)
			: 0;
	}, [profile]);

	if (isLoading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
				<CircularProgress />
			</Box>
		);
	}

	if (error || !profile) {
		return (
			<Container maxWidth="lg" sx={layoutStyles.container}>
				<Alert severity="error">{error || "Joueur introuvable"}</Alert>
			</Container>
		);
	}

	return (
		<Container maxWidth="lg" sx={layoutStyles.container}>
			<Typography variant="h4" fontWeight={700} sx={typographyStyles.gradientTitle}>
				<PersonIcon />
				Profil de {profile.login}
			</Typography>

			<Grid container spacing={3} sx={{ mt: 2 }}>
				<Grid size={{ xs: 12, md: 6 }}>
					<Paper
						elevation={3}
						sx={[paperStyles.gradientPaper, { p: 3, height: "100%" }]}
					>
						<Stack spacing={3} alignItems="center">
							<UserAvatar
								login={profile.login}
								sx={{ ...avatarStyles.large, ...avatarStyles.gradientAvatar }}
							/>
							<Box sx={{ width: "100%" }}>
								<Stack spacing={2} alignItems="center">
									<Box sx={layoutStyles.flexCenter}>
										<PersonIcon color="primary" />
										<Typography variant="h6" fontWeight={600}>
											{profile.login}
										</Typography>
									</Box>
									{!isOwnProfile && currentUser && (
										<FriendControls
											targetIdentifier={identifier}
											targetLogin={profile.login}
											status={friendStatus}
											isLoading={friendStatusLoading}
											onAddFriend={async () => {
												await apiClient.sendFriendRequest(identifier);
											}}
											onRemoveFriend={async () => {
												await apiClient.removeFriendRequest(identifier);
											}}
											onStatusChange={setFriendStatus}
										/>
									)}
								</Stack>
							</Box>
						</Stack>
					</Paper>
				</Grid>

				<Grid size={{ xs: 12, md: 6 }}>
					<Paper
						elevation={3}
						sx={[paperStyles.gradientCard, { height: "100%" }]}
					>
						<Stack spacing={3} alignItems="center" sx={{ py: 2 }}>
							<Typography variant="h6" fontWeight={600} gutterBottom sx={layoutStyles.flexCenter}>
								<TrophyIcon color="primary" />
								Statistiques de jeu
							</Typography>
							<Box sx={{ width: "100%", px: 2 }}>
								<Box sx={dividerStyles.standard} />
							</Box>
							<Grid container spacing={3}>
								<Grid size={{ xs: 6, sm: 3 }}>
									<Box textAlign="center">
										<Typography variant="h4" fontWeight={700} color="primary">
											{profile.totalGames}
										</Typography>
										<Typography
											variant="body2"
											color="text.secondary"
											sx={[layoutStyles.flexCenterJustifyCenter, { mt: 0.5 }]}
										>
											<GameIcon fontSize="small" />
											Parties
										</Typography>
									</Box>
								</Grid>
								<Grid size={{ xs: 6, sm: 3 }}>
									<Box textAlign="center">
										<Typography variant="h4" fontWeight={700} color="success.main">
											{profile.wins}
										</Typography>
										<Typography
											variant="body2"
											color="text.secondary"
											sx={[layoutStyles.flexCenterJustifyCenter, { mt: 0.5 }]}
										>
											<WinIcon fontSize="small" />
											Victoires
										</Typography>
									</Box>
								</Grid>
								<Grid size={{ xs: 6, sm: 3 }}>
									<Box textAlign="center">
										<Typography variant="h4" fontWeight={700} color="error.main">
											{profile.losses}
										</Typography>
										<Typography
											variant="body2"
											color="text.secondary"
											sx={[layoutStyles.flexCenterJustifyCenter, { mt: 0.5 }]}
										>
											<LossIcon fontSize="small" />
											Défaites
										</Typography>
									</Box>
								</Grid>
								<Grid size={{ xs: 6, sm: 3 }}>
									<Box textAlign="center">
										<Typography variant="h4" fontWeight={700} color="text.secondary">
											{profile.draws}
										</Typography>
										<Typography
											variant="body2"
											color="text.secondary"
											sx={[layoutStyles.flexCenterJustifyCenter, { mt: 0.5 }]}
										>
											<DrawIcon fontSize="small" />
											Égalités
										</Typography>
									</Box>
								</Grid>
								<Grid size={{ xs: 12 }}>
									<Box sx={{ width: "100%", my: 2 }}>
										<Box sx={dividerStyles.standard} />
									</Box>
									<Box
										sx={{
											mb: 2,
											px: 6,
											display: "flex",
											alignItems: "center",
											gap: 2,
										}}
									>
										<Typography
											variant="subtitle1"
											fontWeight={600}
											sx={{ width: 90, flexShrink: 0 }}
										>
											Niveau {profile.level}
										</Typography>
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
													width: `${profile.xpRequiredForNextLevel > 0 ? (profile.xpInCurrentLevel / profile.xpRequiredForNextLevel) * 100 : 100}%`,
													background:
														"linear-gradient(90deg, #6366f1 0%, #ec4899 100%)",
													borderRadius: 1,
												}}
											/>
										</Box>
										<Typography
											variant="caption"
											color="text.secondary"
											sx={{ width: 70, flexShrink: 0, ml: "auto", textAlign: "right" }}
										>
											{profile.xpInCurrentLevel}/{profile.xpRequiredForNextLevel}
										</Typography>
									</Box>
									<Grid container spacing={2}>
										<Grid size={{ xs: 6 }}>
											<Box textAlign="center">
												<Typography
													variant="h5"
													fontWeight={700}
													sx={typographyStyles.gradientHeading}
												>
													{profile.eloRating}
												</Typography>
												<Typography variant="body2" color="text.secondary">
													ELO
												</Typography>
											</Box>
										</Grid>
										<Grid size={{ xs: 6 }}>
											<Box textAlign="center">
												<Typography
													variant="h5"
													fontWeight={700}
													sx={typographyStyles.gradientHeading}
												>
													{winrate}%
												</Typography>
												<Typography variant="body2" color="text.secondary">
													Taux de victoire
												</Typography>
											</Box>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Stack>
					</Paper>
				</Grid>
			</Grid>
		</Container>
	);
}
