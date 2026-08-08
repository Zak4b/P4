"use client";

import { Box, Typography, Grid } from "@mui/material";
import { layoutStyles } from "@/lib/styles";

interface StatTileProps {
	value: number;
	label: string;
	icon: React.ReactNode;
	color: string;
}

export function StatTile({ value, label, icon, color }: StatTileProps) {
	return (
		<Grid size={{ xs: 6, sm: 3 }}>
			<Box textAlign="center">
				<Typography variant="h4" fontWeight={700} color={color}>
					{value}
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={[layoutStyles.flexCenterJustifyCenter, { mt: 0.5 }]}>
					{icon}
					{label}
				</Typography>
			</Box>
		</Grid>
	);
}
