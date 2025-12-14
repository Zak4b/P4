"use client";

import React, { useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import { layoutStyles } from "@/lib/styles";
import UserAvatar from "../UserAvatar";
import { useAuth } from "../AuthContext";

interface UserMenuProps {
	isMobile: boolean;
}

const menuOptions = [
	{
		href: "/profile",
		icon: <AccountIcon fontSize="small" />,
		label: "Mon compte",
	},
	{
		href: "/friends",
		icon: <PeopleIcon fontSize="small" />,
		label: "Amis",
	},
	{
		href: "/settings",
		icon: <SettingsIcon fontSize="small" />,
		label: "Paramètres",
	},
];

const UserMenu: React.FC<UserMenuProps> = ({ isMobile }) => {
	const { logout, user } = useAuth();

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
		<>
			<UserAvatar
				login={user?.login || ""}
				size={isMobile ? 40 : 50}
				onClick={handleAvatarClick}
				sx={{
					ml: { xs: 1, md: 2 },
					border: "2px solid rgba(255, 255, 255, 0.5)",
					"&:hover": {
						borderColor: "white",
						cursor: "pointer",
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
							login={user?.login || ""}
							size={40}
							sx={{ bgcolor: "primary.main" }}
						/>
						<Box sx={{ ml: 1.5 }}>
							<Typography variant="body2" fontWeight={600}>
								{user?.login || ""}
							</Typography>
							<Typography variant="caption" color="text.secondary">
								{user?.email || ""}
							</Typography>
						</Box>
					</Box>
				</Box>
				<Divider />
				{menuOptions.map((option) => (
					<MenuItem key={option.href} component={Link} href={option.href}>
						<ListItemIcon>
							{option.icon}
						</ListItemIcon>
						{option.label}
					</MenuItem>
				))}
				<Divider />
				<MenuItem onClick={handleLogout}>
					<ListItemIcon>
						<LogoutIcon fontSize="small" />
					</ListItemIcon>
					Déconnexion
				</MenuItem>
			</Menu>
		</>
	);
};

export default UserMenu;

