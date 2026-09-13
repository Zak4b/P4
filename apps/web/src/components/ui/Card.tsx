import type { ReactNode } from "react";
import MuiCard, { type CardProps as MuiCardProps } from "@mui/material/Card";
import Box, { type BoxProps } from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { toSxArray } from "./toSxArray";

/**
 * Carte composable façon shadcn : `Card` + sous-composants `CardHeader`,
 * `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
 *
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Titre</CardTitle>
 *     <CardDescription>Sous-titre explicatif.</CardDescription>
 *   </CardHeader>
 *   <CardContent>Contenu…</CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */
export function Card({ sx, ...props }: MuiCardProps) {
	return <MuiCard variant="outlined" sx={[{ borderRadius: 4 }, ...toSxArray(sx)]} {...props} />;
}

export function CardHeader({ sx, ...props }: BoxProps) {
	return (
		<Box sx={[{ p: 3, pb: 1.5, display: "flex", flexDirection: "column", gap: 0.5 }, ...toSxArray(sx)]} {...props} />
	);
}

export function CardTitle({ children }: { children: ReactNode }) {
	return (
		<Typography variant="h6" component="h3" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
			{children}
		</Typography>
	);
}

export function CardDescription({ children }: { children: ReactNode }) {
	return (
		<Typography variant="body2" color="text.secondary">
			{children}
		</Typography>
	);
}

export function CardContent({ sx, ...props }: BoxProps) {
	return <Box sx={[{ px: 3, pb: 3 }, ...toSxArray(sx)]} {...props} />;
}

export function CardFooter({ sx, ...props }: BoxProps) {
	return (
		<Box sx={[{ px: 3, pb: 3, pt: 0, display: "flex", alignItems: "center", gap: 1.5 }, ...toSxArray(sx)]} {...props} />
	);
}
