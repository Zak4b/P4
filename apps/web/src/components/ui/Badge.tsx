import type { ReactNode } from "react";
import Chip, { type ChipProps } from "@mui/material/Chip";
import { toSxArray } from "./toSxArray";

export type BadgeVariant = "default" | "secondary" | "outline" | "success" | "warning" | "destructive";

export interface BadgeProps extends Omit<ChipProps, "variant" | "color" | "children" | "label"> {
	variant?: BadgeVariant;
	children: ReactNode;
}

const VARIANT_TO_MUI: Record<BadgeVariant, Pick<ChipProps, "variant" | "color">> = {
	default: { variant: "filled", color: "primary" },
	secondary: { variant: "filled", color: "secondary" },
	outline: { variant: "outlined", color: "default" },
	success: { variant: "filled", color: "success" },
	warning: { variant: "filled", color: "warning" },
	destructive: { variant: "filled", color: "error" },
};

/**
 * Étiquette courte (statut, tag, compteur).
 *
 * ```tsx
 * <Badge>Nouveau</Badge>
 * <Badge variant="success">En ligne</Badge>
 * <Badge variant="outline">Bêta</Badge>
 * ```
 */
export function Badge({ variant = "default", children, sx, ...props }: BadgeProps) {
	const { variant: muiVariant, color } = VARIANT_TO_MUI[variant];
	return (
		<Chip
			variant={muiVariant}
			color={color}
			label={children}
			size="small"
			sx={[{ fontWeight: 600, borderRadius: 1.5 }, ...toSxArray(sx)]}
			{...props}
		/>
	);
}
