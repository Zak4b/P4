"use client";

import { useState, useEffect } from "react";
import { Box, Collapse, Grid, IconButton, Paper, Stack, Typography } from "@mui/material";
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon, PersonAdd as PersonAddIcon } from "@mui/icons-material";
import FriendRequestCard from "./FriendRequestCard";
import type { FriendRequest } from "./friendRequestsTypes";

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
									<FriendRequestCard
										request={request}
										loading={loadingRequestId === request.id}
										onAccept={handleAccept}
										onReject={handleReject}
										onCloseParent={onCloseModal}
									/>
								</Grid>
							))}
						</Grid>
					</Box>
				</Collapse>
			</Paper>
		</Box>
	);
}
