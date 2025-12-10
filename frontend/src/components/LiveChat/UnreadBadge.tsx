import React from "react";
import { Box } from "@mui/material";

interface UnreadBadgeProps {
	count: number;
}

export const UnreadBadge: React.FC<UnreadBadgeProps> = ({ count }) => {
	if (count === 0) return null;

	return (
		<Box
			sx={{
				position: "absolute",
				top: -10,
				right: -6,
				minWidth: 24,
				height: 24,
				borderRadius: "50%",
				bgcolor: "#ef4444",
				color: "white",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				fontSize: "0.75rem",
				fontWeight: 700,
				border: "3px solid white",
				boxShadow: "0 2px 8px rgba(239, 68, 68, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.8)",
				zIndex: 1301,
				animation: "pulse 2s infinite",
				"@keyframes pulse": {
					"0%, 100%": {
						transform: "scale(1)",
					},
					"50%": {
						transform: "scale(1.1)",
					},
				},
			}}
		>
			{count > 99 ? "99+" : count}
		</Box>
	);
};

