"use client";

import { Box, Grid } from "@mui/material";
import { Heading, Muted } from "@/components/ui";
import { typographyStyles } from "@/lib/styles";

function StatItem({ value, label }: { value: number; label: string }) {
	return (
        <Box sx={{
            textAlign: "center"
        }}>
            <Heading
                level={5}
                sx={[{
                    fontWeight: 700
                }, typographyStyles.gradientHeading]}>
				{value}
			</Heading>
            <Muted>{label}</Muted>
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
