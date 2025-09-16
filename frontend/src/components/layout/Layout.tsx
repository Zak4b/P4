import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { apiClient } from "../../api";
import RoomList from "../Rooms/RoomList";
import GameModal from "../GameModal";
import Navbar from "./Navbar";

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [showRooms, setShowRooms] = useState(false);

	useEffect(() => {
		checkLoginStatus();
	}, []);

	const checkLoginStatus = async () => {
		try {
			const status = await apiClient.getLoginStatus();
			setIsLoggedIn(status.isLoggedIn);
		} catch (error) {
			console.error("Failed to check login status:", error);
			setIsLoggedIn(false);
		}
	};

	return (
		<div className="container" style={{ paddingTop: "85px" }}>
			{/* Navbar */}
			<Navbar />

			{/* Main Content */}
			<main>{children}</main>

			{/* Room list OffCanvas */}
			<RoomList show={showRooms} onHide={() => setShowRooms(false)} />

			{/* Game Modal */}
			<GameModal />
		</div>
	);
};

export default Layout;
