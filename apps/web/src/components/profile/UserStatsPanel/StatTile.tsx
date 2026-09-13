"use client";

import { Box, Grid } from "@mui/material";
import { Heading, Text } from "@/components/ui";
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
            <Box sx={{
                textAlign: "center"
            }}>
				<Heading level={4} color={color} sx={{
                    fontWeight: 700
                }}>
					{value}
				</Heading>
				<Text
                    size="md"
                    sx={[{
                        color: "text.secondary"
                    }, layoutStyles.flexCenterJustifyCenter, { mt: 0.5 }]}>
					{icon}
					{label}
				</Text>
			</Box>
        </Grid>
    );
}
