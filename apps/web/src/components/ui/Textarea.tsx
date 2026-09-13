import { forwardRef } from "react";
import TextField, { type TextFieldProps } from "@mui/material/TextField";

export type TextareaProps = Omit<TextFieldProps, "variant" | "multiline"> & {
	minRows?: number;
	maxRows?: number;
};

/**
 * Zone de texte multi-lignes.
 *
 * ```tsx
 * <Textarea label="Message" minRows={3} placeholder="Votre message…" />
 * ```
 */
export const Textarea = forwardRef<HTMLDivElement, TextareaProps>(
	({ minRows = 3, maxRows, ...props }, ref) => (
		<TextField ref={ref} variant="outlined" fullWidth multiline minRows={minRows} maxRows={maxRows} {...props} />
	)
);
Textarea.displayName = "Textarea";
