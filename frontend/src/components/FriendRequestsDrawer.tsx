"use client";

import { useState, useEffect } from "react";
import {
	Box,
	Collapse,
	Typography,
	IconButton,
	Paper,
	Stack,
	Button,
	CircularProgress,
	Grid,
} from "@mui/material";
import {
	ExpandMore as ExpandMoreIcon,
	ExpandLess as ExpandLessIcon,
	PersonAdd as PersonAddIcon,
	PersonRemove as PersonRemoveIcon,
} from "@mui/icons-material";
import UserAvatar from "./UserAvatar";
import UserActionsDropdown from "./UserActionsDropdown";

interface FriendRequest {
	id: string;
	fromUser: { id: string; login: string; eloRating: number };
}

interface FriendRequestsDrawerProps {
	requests: FriendRequest[];
	onCloseModal?: () => void;
	onAccept: (request: FriendRequest) => Promise<void>;
	onReject: (request: FriendRequest) => Promise<void>;
}

export default function FriendRequestsDrawer({
	requests,
	onCloseModal,
	onAccept,
	onReject,
}: FriendRequestsDrawerProps) {
	const [expanded, setExpanded] = useState(requests.length > 0);
	const [loadingRequestId, setLoadingRequestId] = useState<string | null>(null);

	useEffect(() => {
		if (requests.length > 0) setExpanded(true);
	}, [requests.length]);

	if (requests.length === 0) return null;

	const handleAccept = async (request: FriendRequest) => {
		setLoadingRequestId(request.id);
		try {
			await onAccept(request);
		} finally {
			setLoadingRequestId(null);
		}
	};

	const handleReject = async (request: FriendRequest) => {
		setLoadingRequestId(request.id);
		try {
			await onReject(request);
		} finally {
			setLoadingRequestId(null);
		}
	};

	return (
		<Box sx={{ mb: 2 }}>
			<Paper
				elevation={0}
				sx={{
					borderRadius: 2,
					border: "1px solid",
					borderColor: "divider",
					overflow: "hidden",
				}}
			>
				<Box
					component="button"
					onClick={() => setExpanded(!expanded)}
					sx={{
						width: "100%",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						p: 1.5,
						border: "none",
						background: "rgba(245, 158, 11, 0.08)",
						cursor: "pointer",
						textAlign: "left",
						"&:hover": { background: "rgba(245, 158, 11, 0.12)" },
					}}
				>
					<Stack direction="row" alignItems="center" spacing={1}>
						<PersonAddIcon sx={{ color: "warning.main" }} fontSize="small" />
						<Typography variant="subtitle2" fontWeight={600}>
							Demandes en attente
						</Typography>
						<Typography
							variant="caption"
							sx={{
								bgcolor: "warning.main",
								color: "white",
								px: 1,
								borderRadius: 1,
							}}
						>
							{requests.length}
						</Typography>
					</Stack>
					<IconButton size="small" sx={{ p: 0.5 }}>
						{expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
					</IconButton>
				</Box>
				<Collapse in={expanded}>
					<Box sx={{ p: 1.5, pt: 0 }}>
						<Grid container spacing={1.5}>
							{requests.map((request) => (
								<Grid size={{ xs: 12 }} key={request.id}>
									<Paper
										elevation={0}
										sx={{
											p: 1.5,
											display: "flex",
											alignItems: "center",
											gap: 1.5,
											borderRadius: 2,
											border: "1px solid",
											borderColor: "divider",
										}}
									>
										<UserActionsDropdown
											targetUser={{
												id: request.fromUser.id,
												login: request.fromUser.login,
											}}
											currentUserId={undefined}
											fullWidth
											onCloseParent={onCloseModal}
										>
											<Box
												sx={{
													display: "flex",
													alignItems: "center",
													gap: 1.5,
													flex: 1,
													minWidth: 0,
												}}
											>
												<UserAvatar login={request.fromUser.login} size={36} />
												<Stack spacing={0} sx={{ minWidth: 0, flex: 1 }}>
													<Typography variant="body2" fontWeight={600} noWrap>
														{request.fromUser.login}
													</Typography>
													<Typography variant="caption" color="text.secondary">
														{request.fromUser.eloRating} ELO
													</Typography>
												</Stack>
											</Box>
										</UserActionsDropdown>
										<Stack direction="row" spacing={0.5}>
											<Button
												size="small"
												variant="contained"
												color="success"
												disabled={loadingRequestId === request.id}
												onClick={() => handleAccept(request)}
												sx={{ minWidth: 0, px: 1.5 }}
												startIcon={
													loadingRequestId === request.id ? (
														<CircularProgress size={16} color="inherit" />
													) : (
														<PersonAddIcon fontSize="small" />
													)
												}
											>
												Accepter
											</Button>
											<Button
												size="small"
												variant="outlined"
												color="error"
												disabled={loadingRequestId === request.id}
												onClick={() => handleReject(request)}
												sx={{ minWidth: 0, px: 1.5 }}
												startIcon={<PersonRemoveIcon fontSize="small" />}
											>
												Refuser
											</Button>
										</Stack>
									</Paper>
								</Grid>
							))}
						</Grid>
					</Box>
				</Collapse>
			</Paper>
		</Box>
	);
}
