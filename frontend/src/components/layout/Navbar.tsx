"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import { useTheme, useMediaQuery } from "@mui/material";
import PlayIcon from "@mui/icons-material/PlayArrow";
import HistoryIcon from "@mui/icons-material/History";
import RoomIcon from "@mui/icons-material/MeetingRoom";
import TrophyIcon from "@mui/icons-material/EmojiEvents";
import MenuIcon from "@mui/icons-material/Menu";
import {
	appBarStyles,
	layoutStyles,
} from "@/lib/styles";
import UserMenu from "./UserMenu";

interface NavButtonProps {
	href: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	pathname: string;
}

const navOptions = [
	{
		href: "/play",
		icon: <PlayIcon />,
		label: "Play",
	},
	{
		href: "/history",
		icon: <HistoryIcon />,
		label: "History",
	},
	{
		href: "/leaderboard",
		icon: <TrophyIcon />,
		label: "Leaderboard",
	},
];

function NavButton({ href, icon, children, pathname }: NavButtonProps) {
	const isActive = pathname === href;
	return (
		<Link href={href} style={{ textDecoration: "none" }}>
			<Button
				color="inherit"
				startIcon={icon}
				sx={isActive ? appBarStyles.navButtonActive : appBarStyles.navButton}
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
	const pathname = usePathname();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
	const mobileMenuOpen = Boolean(mobileMenuAnchor);

	const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setMobileMenuAnchor(event.currentTarget);
	};

	const handleMobileMenuClose = () => {
		setMobileMenuAnchor(null);
	};

	return (
		<AppBar
			position="fixed"
			sx={appBarStyles.gradientAppBar}
		>
			<Toolbar sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
				{isMobile && (
					<IconButton
						color="inherit"
						edge="start"
						onClick={handleMobileMenuOpen}
						sx={{ mr: 1 }}
					>
						<MenuIcon />
					</IconButton>
				)}

				<Typography
					variant="h6"
					component={Link}
					href="/"
					sx={{
						flexGrow: { xs: 1, md: 0 },
						mr: { xs: 1, md: 4 },
						fontWeight: 700,
						cursor: "pointer",
						color: "inherit",
						textDecoration: "none",
						fontSize: { xs: "1rem", sm: "1.25rem" },
					}}
				>
					🎮 P4 Game
				</Typography>

				{/* Desktop Navigation */}
				<Box
					sx={{
						...(layoutStyles.flexCenter),
						flexGrow: 1,
						display: { xs: "none", md: "flex" },
					}}
				>
					{navOptions.map((option) => (
						<NavButton key={option.href} href={option.href} icon={option.icon} pathname={pathname || ""}>
							{option.label}
						</NavButton>
					))}
				</Box>

				{/* Desktop Rooms Button */}
				<Button
					color="inherit"
					startIcon={<RoomIcon />}
					onClick={onRoomsClick}
					sx={{
						...appBarStyles.navButtonActive,
						mr: { xs: 0, md: 2 },
						display: { xs: "none", md: "flex" },
					}}
				>
					Rooms
				</Button>

				<UserMenu isMobile={isMobile} />

				{/* Mobile Menu */}
				<Menu
					anchorEl={mobileMenuAnchor}
					open={mobileMenuOpen}
					onClose={handleMobileMenuClose}
					transformOrigin={{ horizontal: "left", vertical: "top" }}
					anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
					sx={{ display: { md: "none" } }}
				>
					{navOptions.map((option) => (
						<MenuItem
							key={option.href}
							component={Link}
							href={option.href}
							onClick={handleMobileMenuClose}
							selected={pathname === option.href}
						>
							<ListItemIcon>
								{option.icon}
							</ListItemIcon>
							{option.label}
						</MenuItem>
					))}
					<Divider />
					<MenuItem onClick={() => { onRoomsClick(); handleMobileMenuClose(); }}>
						<ListItemIcon>
							<RoomIcon fontSize="small" />
						</ListItemIcon>
						Rooms
					</MenuItem>
				</Menu>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
