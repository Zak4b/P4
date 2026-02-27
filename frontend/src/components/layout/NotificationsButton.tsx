"use client";

import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import NotificationsIcon from "@mui/icons-material/Notifications";

const NotificationsButton: React.FC = () => {
	const [notificationCount] = useState(100);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<IconButton
				color="inherit"
				onClick={handleClick}
				aria-label="Notifications"
				sx={{ mr: 0.5 }}
			>
				<Badge
					badgeContent={notificationCount > 0 ? notificationCount : undefined}
					max={10}
					color="error"
				>
					<NotificationsIcon />
				</Badge>
			</IconButton>
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				transformOrigin={{ horizontal: "right", vertical: "top" }}
				anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
			>
				<MenuItem disabled>
					<Typography variant="body2" color="text.secondary">
						{notificationCount > 0
							? `${notificationCount} notification(s)`
							: "Aucune notification"}
					</Typography>
				</MenuItem>
			</Menu>
		</>
	);
};

export default NotificationsButton;
