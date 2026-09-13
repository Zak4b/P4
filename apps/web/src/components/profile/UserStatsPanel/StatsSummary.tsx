"use client";

import { Box, Grid, Typography } from "@mui/material";
import { typographyStyles } from "@/lib/styles";

function StatItem({ value, label }: { value: number; label: string }) {
	return (
        <Box sx={{
            textAlign: "center"
        }}>
            <Typography
                variant="h5"
                sx={[{
                    fontWeight: 700
                }, typographyStyles.gradientHeading]}>
				{value}
			</Typography>
            <Typography variant="body2" sx={{
                color: "text.secondary"
            }}>
				{label}
			</Typography>
        </Box>
    );
}

interface StatsSummaryProps {
	eloRating: number;
	winrate: number;
}

export function StatsSummary({ eloRating, winrate }: StatsSummaryProps) {
	return (
		<Grid container spacing={2}>
			<Grid size={{ xs: 6 }}>
				<StatItem value={eloRating} label="ELO" />
			</Grid>
			<Grid size={{ xs: 6 }}>
				<StatItem value={winrate} label="Taux de victoire" />
			</Grid>
		</Grid>
	);
}
