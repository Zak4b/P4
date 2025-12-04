import React, { useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import { Container, Box } from "@mui/material";
import RoomList from "../Rooms/RoomList";
import GameModal from "../GameModal";
import LiveChat from "../LiveChat";
import Navbar from "./Navbar";

const Layout: React.FC = () => {
	const [showRooms, setShowRooms] = useState(false);
	const [searchParams] = useSearchParams();
	const roomId = searchParams.get("roomId") || "1";

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
				<Outlet />
			</Container>

			{/* Room list Drawer */}
			<RoomList open={showRooms} onClose={() => setShowRooms(false)} />

			{/* Game Modal */}
			<GameModal />

			{/* Live Chat - Fixed position */}
			<LiveChat roomId={roomId} />
		</Box>
	);
};

export default Layout;
