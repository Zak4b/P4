"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Heading } from "@/components/ui";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import { useTheme, useMediaQuery } from "@mui/material";
import PlayIcon from "@mui/icons-material/PlayArrow";
import RoomIcon from "@mui/icons-material/MeetingRoom";
import TrophyIcon from "@mui/icons-material/EmojiEvents";
import MenuIcon from "@mui/icons-material/Menu";
import { appBarStyles, layoutStyles } from "@/lib/styles";
import UserMenu from "./UserMenu";
import NotificationsButton from "./NotificationsButton";

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
		label: "Jouer",
	},
	{
		href: "/leaderboard",
		icon: <TrophyIcon />,
		label: "Classement",
	},
];

function NavButton({ href, icon, children, pathname }: NavButtonProps) {
	const isActive = pathname === href;
	return (
		<Link href={href} style={{ textDecoration: "none" }}>
			<Button color="inherit" startIcon={icon} sx={isActive ? appBarStyles.navButtonActive : appBarStyles.navButton}>
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
		<AppBar position="fixed" sx={appBarStyles.gradientAppBar}>
			<Toolbar sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
				{isMobile && (
					<IconButton color="inherit" edge="start" onClick={handleMobileMenuOpen} sx={{ mr: 1 }}>
						<MenuIcon />
					</IconButton>
				)}

				<Box
					component={Link}
					href="/"
					sx={{
						...layoutStyles.flexCenter,
						flexGrow: { xs: 1, md: 0 },
						mr: { xs: 1, md: 4 },
						color: "inherit",
						textDecoration: "none",
					}}
				>
					<Heading
						level={6}
						component="span"
						sx={{ fontWeight: 700, fontSize: { xs: "1.125rem", sm: "1.375rem" }, letterSpacing: "-0.02em" }}
					>
						P4
					</Heading>
					{/* Les deux jetons, dans l'ordre du premier coup. */}
					<Box aria-hidden sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "board.player1" }} />
					<Box aria-hidden sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "board.player2", ml: -0.5 }} />
				</Box>

				{/* Desktop Navigation */}
				<Box
					sx={{
						...layoutStyles.flexCenter,
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

				{/* Bouton parties (bureau) */}
				<Button
					color="inherit"
					startIcon={<RoomIcon />}
					onClick={onRoomsClick}
					variant="contained"
					sx={{
						mr: { xs: 0, md: 2 },
						display: { xs: "none", md: "flex" },
						bgcolor: "board.player2",
						color: "board.player2Contrast",
						"&:hover": { bgcolor: "secondary.dark" },
					}}
				>
					Parties
				</Button>

				<NotificationsButton />
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
							<ListItemIcon>{option.icon}</ListItemIcon>
							{option.label}
						</MenuItem>
					))}
					<Divider />
					<MenuItem
						onClick={() => {
							onRoomsClick();
							handleMobileMenuClose();
						}}
					>
						<ListItemIcon>
							<RoomIcon fontSize="small" />
						</ListItemIcon>
						Parties
					</MenuItem>
				</Menu>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
