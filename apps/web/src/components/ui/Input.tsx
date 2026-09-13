import { forwardRef } from "react";
import TextField, { type TextFieldProps } from "@mui/material/TextField";

export type InputProps = Omit<TextFieldProps, "variant">;

/**
 * Champ texte de base du kit (enrobe `TextField` en `outlined`).
 *
 * ```tsx
 * <Input label="Email" placeholder="vous@exemple.com" />
 * <Input label="Mot de passe" type="password" error helperText="Requis" />
 * ```
 */
export const Input = forwardRef<HTMLDivElement, InputProps>((props, ref) => (
	<TextField ref={ref} variant="outlined" fullWidth size="medium" {...props} />
));
Input.displayName = "Input";
