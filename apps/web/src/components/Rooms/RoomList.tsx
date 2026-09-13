"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Drawer, Box, List, ListItem, CircularProgress, Divider } from "@mui/material";
import { Heading, Text, Muted, Button } from "@/components/ui";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import { useRoomsQuery } from "@/lib/api/room/useRoomQuery";
import RoomBadge from "./RoomBadge";
import RoomForm from "./RoomForm";
import { buttonStyles } from "@/lib/styles";

interface RoomListProps {
	open: boolean;
	onClose: () => void;
}

const RoomList: React.FC<RoomListProps> = ({ open, onClose }) => {
	const router = useRouter();
	const roomsQuery = useRoomsQuery({ enabled: open });
	const rooms = roomsQuery.data ?? [];
	const isLoading = roomsQuery.isFetching;

	const loadRooms = () => {
		roomsQuery.refetch().catch((err: unknown) => console.error(err));
	};

	const handleJoinRoom = (roomId: string) => {
		router.push(`/play/${roomId}`);
		onClose();
	};

	return (
		<Drawer
			anchor="right"
			open={open}
			onClose={onClose}
			slotProps={{
				paper: {
					sx: {
						width: { xs: "100%", sm: 400 },
						backgroundColor: "background.default",
					},
				},
			}}
		>
			<Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
				<Box sx={{ p: 2, backgroundColor: "primary.main", color: "primary.contrastText" }}>
					<Heading level={6}>Rooms</Heading>
				</Box>
				<Box sx={{ p: 2, flexGrow: 1, overflowY: "auto" }}>
					<RoomForm onSubmit={onClose} onRoomCreated={loadRooms} />
					<Divider sx={{ my: 2 }} />
					{isLoading ? (
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								py: 4,
							}}
						>
							<CircularProgress />
						</Box>
					) : (
						<List>
							{rooms.map((room) => (
								<ListItem
									key={room.id}
									sx={{
										mb: 1,
										bgcolor: "background.paper",
										borderRadius: 2,
										boxShadow: (theme) => theme.vars.palette.shadow.card,
										flexDirection: "column",
										alignItems: "stretch",
									}}
								>
									<Box
										sx={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											mb: 1,
										}}
									>
										<Text variant="subtitle1" sx={{ fontWeight: 600 }}>
											{room.name}
										</Text>
										<RoomBadge status={room.status} />
									</Box>
									<Box
										sx={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
										}}
									>
										<Muted>
											{room.count}/{room.max} joueurs
										</Muted>
										<Button
											size="sm"
											onClick={() => handleJoinRoom(room.id)}
											disabled={!room.joinable}
											sx={buttonStyles.gradientButton}
										>
											Rejoindre
										</Button>
									</Box>
								</ListItem>
							))}
						</List>
					)}
				</Box>
				<Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
					<Button
						fullWidth
						variant="outline"
						startIcon={<RefreshIcon />}
						onClick={loadRooms}
						disabled={isLoading}
						sx={buttonStyles.primaryOutlined}
					>
						Actualiser
					</Button>
				</Box>
			</Box>
		</Drawer>
	);
};

export default RoomList;
