"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Container, Box } from "@mui/material";
import RoomList from "../Rooms/RoomList";
import GameModal from "../GameModal";
import LiveChat from "../LiveChat";
import Navbar from "./Navbar";
import { colors } from "@/lib/styles";

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
				display: "flex",
				flexDirection: "column",
				background: colors.backgroundLight,
			}}
		>
			{/* Navbar */}
			<Navbar onRoomsClick={() => setShowRooms(true)} />

			{/* Main Content */}
			<Container
				maxWidth={false}
				disableGutters
				sx={{
					mt: 8,
					flexGrow: 1,
					display: "flex",
					flexDirection: "column",
					px: { xs: 2, md: 4 },
				}}
			>
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
