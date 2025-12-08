"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Drawer, Box, Typography, List, ListItem, ListItemText, Button, CircularProgress, Divider, Stack, Chip } from "@mui/material";
import { Refresh as RefreshIcon, Close as CloseIcon } from "@mui/icons-material";
import { apiClient, Room } from "@/lib/api";
import RoomBadge from "./RoomBadge";
import RoomForm from "./RoomForm";

interface RoomListProps {
	open: boolean;
	onClose: () => void;
}

const RoomList: React.FC<RoomListProps> = ({ open, onClose }) => {
	const [rooms, setRooms] = useState<Room[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (open) loadRooms();
	}, [open]);

	const loadRooms = async () => {
		setIsLoading(true);
		try {
			const rooms = await apiClient.getRooms();
			setRooms(rooms);
		} catch (error) {
			console.error("Failed to load rooms:", error);
		} finally {
			setIsLoading(false);
		}
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
					background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
				},
			}}
		>
			<Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
				<Box sx={{ p: 2, background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)", color: "white" }}>
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
												background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
												"&:hover": {
													background: "linear-gradient(135deg, #4f46e5 0%, #db2777 100%)",
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
