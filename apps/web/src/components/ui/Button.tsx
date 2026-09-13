import { forwardRef } from "react";
import MuiButton, { type ButtonProps as MuiButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { toSxArray } from "./toSxArray";

/**
 * Variantes façon shadcn, retranscrites sur les primitives MUI (`variant` + `color`).
 * On garde le vocabulaire shadcn (`default`, `outline`, `ghost`, `destructive`, `link`)
 * et on ajoute `success`/`destructiveOutline` pour les cas récurrents de l'app
 * (accepter/refuser une demande...), mais tout repose sur le thème MUI existant.
 */
export type ButtonVariant = "default" | "secondary" | "outline" | "ghost" | "destructive" | "destructiveOutline" | "link" | "success";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends Omit<MuiButtonProps, "variant" | "color" | "size"> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	/** Affiche un spinner et désactive le bouton. */
	loading?: boolean;
}

const VARIANT_TO_MUI: Record<ButtonVariant, Pick<MuiButtonProps, "variant" | "color">> = {
	default: { variant: "contained", color: "primary" },
	secondary: { variant: "contained", color: "secondary" },
	outline: { variant: "outlined", color: "primary" },
	ghost: { variant: "text", color: "primary" },
	destructive: { variant: "contained", color: "error" },
	destructiveOutline: { variant: "outlined", color: "error" },
	link: { variant: "text", color: "primary" },
	success: { variant: "contained", color: "success" },
};

const SIZE_TO_SX: Record<ButtonSize, object> = {
	sm: { px: 1.5, py: 0.5, fontSize: "0.8125rem", minWidth: "auto" },
	md: {},
	lg: { px: 3.5, py: 1.5, fontSize: "1rem" },
	icon: { px: 1, py: 1, minWidth: 0, width: 40, height: 40, borderRadius: "50%" },
};

/**
 * Bouton d'action de base du kit.
 *
 * ```tsx
 * <Button>Valider</Button>
 * <Button variant="outline" size="sm">Annuler</Button>
 * <Button variant="destructive" loading>Supprimer</Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>((
	{ variant = "default", size = "md", loading = false, disabled, sx, children, ...props },
	ref
) => {
	const { variant: muiVariant, color } = VARIANT_TO_MUI[variant];
	const linkSx =
		variant === "link"
			? { textDecoration: "underline", p: 0, minWidth: "auto", "&:hover": { backgroundColor: "transparent", textDecoration: "underline" } }
			: {};
	return (
		<MuiButton
			ref={ref}
			variant={muiVariant}
			color={color}
			disabled={(disabled ?? false) || loading}
			sx={[linkSx, SIZE_TO_SX[size], ...toSxArray(sx)]}
			startIcon={loading ? undefined : props.startIcon}
			{...props}
		>
			{loading ? <CircularProgress size={18} color="inherit" sx={{ mr: children ? 1 : 0 }} /> : null}
			{children}
		</MuiButton>
	);
});
Button.displayName = "Button";
