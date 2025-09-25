import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
	const { logout } = useAuth();
	const [showRooms, setShowRooms] = useState(false);

	const handleLogout = async () => await logout();

	return (
		<nav className="navbar navbar-expand-lg fixed-top bg-dark border-bottom border-body" data-bs-theme="dark">
			<div className="container-fluid">
				<NavLink className="navbar-brand" to="/">
					P4 Game
				</NavLink>
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav me-auto">
						<li className="nav-item">
							<NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/">
								Play
							</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/history">
								History
							</NavLink>
						</li>
						<li className="nav-item">
							<button className="nav-link btn btn-link" onClick={handleLogout} style={{ border: "none", background: "none" }}>
								Logout
							</button>
						</li>
					</ul>
					<button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvas" onClick={() => setShowRooms(true)}>
						Rooms
					</button>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
