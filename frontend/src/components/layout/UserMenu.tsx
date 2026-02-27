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
import { useModalPortal } from "@/lib/hooks/useModalPortal";

interface UserMenuProps {
	isMobile: boolean;
}

type MenuOption = {
	icon: React.ReactNode;
	label: string;
} & (
		| { type: "link"; href: string }
		| { type: "action"; onClick: () => void }
	);

const UserMenu: React.FC<UserMenuProps> = ({ isMobile }) => {
	const { logout, user } = useAuth();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const friendsModal = useModalPortal({
		title: "Amis",
		content: "Liste",
		size: "sm",
	});

	const menuOptions: MenuOption[] = [
		{ type: "link", href: "/profile", icon: <AccountIcon fontSize="small" />, label: "Mon compte" },
		{
			type: "action",
			onClick: friendsModal.open,
			icon: <PeopleIcon fontSize="small" />,
			label: "Amis",
		},
		{ type: "link", href: "/settings", icon: <SettingsIcon fontSize="small" />, label: "Paramètres" },
	];

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
					ml: 1,
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
				{menuOptions.map((option) =>
					option.type === "link" ? (
						<MenuItem key={option.href} component={Link} href={option.href}>
							<ListItemIcon>{option.icon}</ListItemIcon>
							{option.label}
						</MenuItem>
					) : (
						<MenuItem key={option.label} onClick={option.onClick}>
							<ListItemIcon>{option.icon}</ListItemIcon>
							{option.label}
						</MenuItem>
					)
				)}
				<Divider />
				<MenuItem onClick={handleLogout}>
					<ListItemIcon>
						<LogoutIcon fontSize="small" />
					</ListItemIcon>
					Déconnexion
				</MenuItem>
			</Menu>
			{friendsModal.modal}
		</>
	);
};

export default UserMenu;

