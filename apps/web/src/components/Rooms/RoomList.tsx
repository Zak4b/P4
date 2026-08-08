"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Drawer, Box, Typography, List, ListItem, Button, CircularProgress, Divider } from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import { useRoomsQuery } from "@/lib/api/room/useRoomQuery";
import RoomBadge from "./RoomBadge";
import RoomForm from "./RoomForm";
import { colors } from "@/lib/styles";

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
		roomsQuery.refetch().catch(() => {});
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
			PaperProps={{
				sx: {
					width: { xs: "100%", sm: 400 },
					background: colors.backgroundLight,
				},
			}}
		>
			<Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
				<Box sx={{ p: 2, backgroundColor: colors.primary, color: "white" }}>
					<Typography variant="h6" fontWeight={700}>
						Rooms
					</Typography>
				</Box>
				<Box sx={{ p: 2, flexGrow: 1, overflowY: "auto" }}>
					<RoomForm onSubmit={onClose} onRoomCreated={loadRooms} />
					<Divider sx={{ my: 2 }} />
					{isLoading ? (
						<Box display="flex" justifyContent="center" alignItems="center" py={4}>
							<CircularProgress />
						</Box>
					) : (
						<List>
							{rooms.map((room) => (
								<ListItem
									key={room.id}
									sx={{
										mb: 1,
										bgcolor: "white",
										borderRadius: 2,
										boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
										flexDirection: "column",
										alignItems: "stretch",
									}}
								>
									<Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
										<Typography variant="subtitle1" fontWeight={600}>
											{room.name}
										</Typography>
										<RoomBadge status={room.status} />
									</Box>
									<Box display="flex" justifyContent="space-between" alignItems="center">
										<Typography variant="body2" color="text.secondary">
											{room.count}/{room.max} joueurs
										</Typography>
										<Button
											variant="contained"
											size="small"
											onClick={() => handleJoinRoom(room.id)}
											disabled={!room.joinable}
											sx={{
												backgroundColor: colors.primary,
												"&:hover": {
													backgroundColor: colors.primaryHover,
												},
											}}
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
						variant="outlined"
						startIcon={<RefreshIcon />}
						onClick={loadRooms}
						disabled={isLoading}
						sx={{
							borderColor: "#6366f1",
							color: "#6366f1",
							"&:hover": {
								borderColor: "#4f46e5",
								background: "rgba(99, 102, 241, 0.1)",
							},
						}}
					>
						Actualiser
					</Button>
				</Box>
			</Box>
		</Drawer>
	);
};

export default RoomList;
