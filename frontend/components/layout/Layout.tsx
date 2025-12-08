"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Container, Box } from "@mui/material";
import RoomList from "../Rooms/RoomList";
import GameModal from "../GameModal";
import LiveChat from "../LiveChat";
import Navbar from "./Navbar";

interface LayoutProps {
	children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	const [showRooms, setShowRooms] = useState(false);
	const params = useParams();
	const roomId = (params?.id as string) || "1";

	return (
		<Box
			sx={{
				minHeight: "100vh",
				background: "linear-gradient(135deg, #e0e7ff 0%, #fce7f3 50%, #fef3c7 100%)",
			}}
		>
			{/* Navbar */}
			<Navbar onRoomsClick={() => setShowRooms(true)} />

			{/* Main Content */}
			<Container maxWidth="xl" sx={{ mt: 10, mb: 4 }}>
				{children}
			</Container>

			{/* Room list Drawer */}
			<RoomList open={showRooms} onClose={() => setShowRooms(false)} />

			{/* Game Modal */}
			<GameModal />

			{/* Live Chat - Fixed position */}
			<LiveChat roomId={roomId} />
		</Box>
	);
}
