import type { ReactNode, ElementType } from "react";
import MuiTypography, { type TypographyProps } from "@mui/material/Typography";
import { toSxArray } from "./toSxArray";

/**
 * Échelle de texte du kit : `Heading` pour les titres (`h1`-`h6`), `Text` pour
 * le corps (`lg`/`md`/`sm`/`xs`, avec écappatoire `variant` pour les cas MUI
 * précis type `subtitle1`/`overline`), `Muted` et `Label` pour les usages annexes.
 *
 * ```tsx
 * <Heading level={2}>Section</Heading>
 * <Text>Paragraphe standard.</Text>
 * <Text variant="overline">Étiquette</Text>
 * <Muted>Texte secondaire, discret.</Muted>
 * <Label htmlFor="email">Email</Label>
 * ```
 */

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps extends Omit<TypographyProps, "variant"> {
	level?: HeadingLevel;
	/** Écappatoire pour un `component` polymorphe (ex. `next/link`) qui attend `href`. */
	href?: string;
}

export function Heading({ level = 1, component, sx, ...props }: HeadingProps) {
	const tag = (component ?? (`h${level}` as ElementType)) as ElementType;
	return <MuiTypography variant={`h${level}`} component={tag} sx={[{ fontWeight: 700 }, ...toSxArray(sx)]} {...props} />;
}

export type TextSize = "lg" | "md" | "sm" | "xs";

const TEXT_VARIANT: Record<TextSize, NonNullable<TypographyProps["variant"]>> = {
	lg: "body1",
	md: "body2",
	sm: "caption",
	xs: "caption",
};

export interface TextProps extends Omit<TypographyProps, "size"> {
	size?: TextSize;
}

export function Text({ size = "lg", variant, sx, ...props }: TextProps) {
	const sxArray = size === "xs" ? [{ fontSize: "0.6875rem" }, ...toSxArray(sx)] : toSxArray(sx);
	return <MuiTypography variant={variant ?? TEXT_VARIANT[size]} sx={sxArray} {...props} />;
}

export function Muted({ children, variant = "body2", sx, ...props }: TypographyProps) {
	return (
		<MuiTypography variant={variant} color="text.secondary" sx={sx} {...props}>
			{children}
		</MuiTypography>
	);
}

export interface LabelProps {
	htmlFor?: string;
	children: ReactNode;
	required?: boolean;
}

/** Libellé de champ de formulaire, indépendant de `TextField` (utile pour des contrôles custom). */
export function Label({ htmlFor, children, required }: LabelProps) {
	return (
		<MuiTypography
			component="label"
			htmlFor={htmlFor}
			variant="body2"
			sx={{ fontWeight: 600, color: "text.primary", display: "inline-block", mb: 0.5 }}
		>
			{children}
			{required && (
				<MuiTypography component="span" color="error.main" sx={{ ml: 0.5 }}>
					*
				</MuiTypography>
			)}
		</MuiTypography>
	);
}
