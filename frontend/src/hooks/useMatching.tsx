"use client";

import { useEffect } from "react";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { Cancel } from "@mui/icons-material";
import { useWebSocket } from "@/components/WebSocketProvider";
import { useModalPortal } from "@/lib/hooks/useModalPortal";
import { colors } from "@/lib/styles";

export function useMatching() {
	const { socket, isConnected } = useWebSocket();

	const matchmakingModal = useModalPortal({
		title: "Recherche d'adversaire",
		closable: false,
		size: "xs",
		content: ({ close }) => {
			const handleCancel = () => {
				if (socket) socket.emit("matchmaking-leave");
				close();
			};
			return (
				<Stack spacing={3} alignItems="center">
					<CircularProgress />
					<Typography color="text.secondary">En attente d'un adversaire...</Typography>
					<Button
						variant="outlined"
						size="large"
						startIcon={<Cancel />}
						onClick={handleCancel}
						sx={{
							py: 2,
							px: 4,
							fontSize: "1.1rem",
							borderRadius: 3,
							textTransform: "none",
							fontWeight: "bold",
							borderColor: colors.primary,
							color: colors.primary,
							"&:hover": {
								borderColor: colors.primaryHover,
								backgroundColor: "rgba(99, 102, 241, 0.08)",
							},
						}}
					>
						Annuler
					</Button>
				</Stack>
			);
		},
	});

	const startMatchmaking = () => {
		if (!socket || !isConnected) return;
		socket.emit("matchmaking-join");
		matchmakingModal.open();
	};

	useEffect(() => {
		return () => {
			if (matchmakingModal.isOpen && socket) socket.emit("matchmaking-leave");
		};
	}, [matchmakingModal.isOpen, socket]);

	return {
		modal: matchmakingModal.modal,
		startMatchmaking,
		isConnected,
	};
}
