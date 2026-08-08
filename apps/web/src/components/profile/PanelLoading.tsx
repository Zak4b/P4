"use client";

import { Box, CircularProgress, Paper, type SxProps, type Theme } from "@mui/material";

interface PanelLoadingProps {
	sx: SxProps<Theme>;
}

/** État de chargement partagé entre les panels de profil (avatar/infos et stats). */
export function PanelLoading({ sx }: PanelLoadingProps) {
	return (
		<Paper elevation={3} sx={sx}>
			<Box display="flex" justifyContent="center" py={4}>
				<CircularProgress />
			</Box>
		</Paper>
	);
}
