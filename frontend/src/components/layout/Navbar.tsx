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
import UserAvatar from "../UserAvatar";

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
				startIcon={icon}
				sx={isActive ? { ...(appBarStyles.navButton), bgcolor: "rgba(255, 255, 255, 0.2)" } : appBarStyles.navButton}
			>
				{children}
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

				<Box sx={{ ...(layoutStyles.flexCenter), flexGrow: 1 }}>
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
					sx={{ ...appBarStyles.navButtonActive, mr: 2 }}
				>
					Rooms
				</Button>

						{user && (
					<>
							<UserAvatar
								login={user.login}
								size={50}
								onClick={handleAvatarClick}
								sx={{
									ml: 2,
									border: "2px solid rgba(255, 255, 255, 0.5)",
									"&:hover": {
										borderColor: "white",
									},
								}}
							/>
						<Menu
							anchorEl={anchorEl}
							open={open}
							onClose={handleMenuClose}
							onClick={handleMenuClose}
							transformOrigin={{ horizontal: "right", vertical: "top" }}
							anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
						>
							<Box sx={{ px: 2, py: 1.5 }}>
								<Box sx={layoutStyles.flexCenter}>
									<UserAvatar
										login={user.login}
										size={40}
										sx={{ bgcolor: "primary.main" }}
									/>
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
