"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Box,
	IconButton,
	Menu,
	MenuItem,
	Avatar,
	Divider,
	ListItemIcon,
} from "@mui/material";
import {
	PlayArrow as PlayIcon,
	History as HistoryIcon,
	MeetingRoom as RoomIcon,
	Logout as LogoutIcon,
	AccountCircle as AccountIcon,
	Settings as SettingsIcon,
} from "@mui/icons-material";
import { useAuth } from "../AuthContext";
import {
	appBarStyles,
	layoutStyles,
} from "@/lib/styles";

interface NavButtonProps {
	href: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	pathname: string;
}

function NavButton({ href, icon, children, pathname }: NavButtonProps) {
	const isActive = pathname === href;
	return (
		<Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
			<Button
				color="inherit"
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				startIcon={icon as any}
				sx={isActive ? { ...(appBarStyles.navButton as any), bgcolor: "rgba(255, 255, 255, 0.2)" } : appBarStyles.navButton}
			>
				{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
				{children as any}
			</Button>
		</Link>
	);
}

interface NavbarProps {
	onRoomsClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onRoomsClick }) => {
	const { logout, user } = useAuth();
	const pathname = usePathname();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = async () => {
		await logout();
		setAnchorEl(null);
	};

const getInitials = (login?: string | null) => {
	if (!login) return "";
	return login
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<AppBar
			position="fixed"
			sx={appBarStyles.gradientAppBar}
		>
			<Toolbar>
				<Typography
					variant="h6"
					component={Link}
					href="/"
					sx={{
						flexGrow: 0,
						mr: 4,
						fontWeight: 700,
						cursor: "pointer",
						color: "inherit",
						textDecoration: "none",
					}}
				>
					🎮 P4 Game
				</Typography>

				<Box sx={{ ...(layoutStyles.flexCenter as any), flexGrow: 1 }}>
					<NavButton href="/play" icon={<PlayIcon />} pathname={pathname || ""}>
						Play
					</NavButton>
					<NavButton
						href="/history"
						icon={<HistoryIcon />}
						pathname={pathname || ""}
					>
						History
					</NavButton>
				</Box>

				<Button
					color="inherit"
					startIcon={<RoomIcon />}
					onClick={onRoomsClick}
					sx={{ ...(appBarStyles.navButtonActive as any), mr: 2 }}
				>
					Rooms
				</Button>

						{user && (
					<>
						<IconButton
							onClick={handleAvatarClick}
							size="small"
							sx={{
								ml: 2,
								border: "2px solid rgba(255, 255, 255, 0.5)",
								"&:hover": {
									borderColor: "white",
								},
							}}
						>
							<Avatar
								sx={{
									width: 40,
									height: 40,
									bgcolor: "rgba(255, 255, 255, 0.3)",
									color: "white",
									fontWeight: 700,
									fontSize: "1rem",
								}}
							>
								{getInitials(user.login)}
							</Avatar>
						</IconButton>
						<Menu
							anchorEl={anchorEl}
							open={open}
							onClose={handleMenuClose}
							onClick={handleMenuClose}
							PaperProps={{
								elevation: 3,
								sx: {
									overflow: "visible",
									filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
									mt: 1.5,
									minWidth: 200,
									"& .MuiAvatar-root": {
										width: 32,
										height: 32,
										ml: -0.5,
										mr: 1,
									},
									"&:before": {
										content: '""',
										display: "block",
										position: "absolute",
										top: 0,
										right: 14,
										width: 10,
										height: 10,
										bgcolor: "background.paper",
										transform: "translateY(-50%) rotate(45deg)",
										zIndex: 0,
									},
								},
							}}
							transformOrigin={{ horizontal: "right", vertical: "top" }}
							anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
						>
							<Box sx={{ px: 2, py: 1.5 }}>
								<Box sx={layoutStyles.flexCenter}>
									<Avatar
										sx={[
											{ bgcolor: "primary.main", width: 40, height: 40 },
										]}
									>
										{getInitials(user.login)}
									</Avatar>
									<Box sx={{ ml: 1.5 }}>
										<Typography variant="body2" fontWeight={600}>
											{user.login}
										</Typography>
										<Typography variant="caption" color="text.secondary">
											{user.email}
										</Typography>
									</Box>
								</Box>
							</Box>
							<Divider />
							<MenuItem component={Link} href="/account">
								<ListItemIcon>
									<AccountIcon fontSize="small" />
								</ListItemIcon>
								Mon compte
							</MenuItem>
							<MenuItem component={Link} href="/settings">
								<ListItemIcon>
									<SettingsIcon fontSize="small" />
								</ListItemIcon>
								Paramètres
							</MenuItem>
							<Divider />
							<MenuItem onClick={handleLogout}>
								<ListItemIcon>
									<LogoutIcon fontSize="small" />
								</ListItemIcon>
								Logout
							</MenuItem>
						</Menu>
					</>
				)}
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
