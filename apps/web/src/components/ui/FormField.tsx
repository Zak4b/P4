import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import { Label } from "./Typography";

export interface FormFieldProps {
	/** Identifiant du champ, relié au `Label` via `htmlFor`. */
	htmlFor?: string;
	label?: string;
	required?: boolean;
	/** Message d'erreur ; s'affiche en rouge sous le champ. */
	error?: string;
	/** Aide contextuelle, affichée quand il n'y a pas d'erreur. */
	description?: string;
	children: ReactNode;
}

/**
 * Enveloppe un contrôle de formulaire quelconque (pas seulement `Input`) avec
 * un `Label`, une description et un message d'erreur — utile pour les
 * contrôles composites (groupe de radios, `Checkbox`, contrôle custom) qui
 * n'ont pas de `label`/`helperText` intégrés comme `TextField`.
 *
 * ```tsx
 * <FormField label="Pseudo" htmlFor="username" error={errors.username}>
 *   <Input id="username" value={username} onChange={...} />
 * </FormField>
 * ```
 */
export function FormField({ htmlFor, label, required, error, description, children }: FormFieldProps) {
	return (
		<Box sx={{ display: "flex", flexDirection: "column" }}>
			{label && (
				<Label htmlFor={htmlFor} required={required}>
					{label}
				</Label>
			)}
			{children}
			{(error ?? description) && (
				<FormHelperText error={Boolean(error)} sx={{ mx: 1.75, mt: 0.5 }}>
					{error ?? description}
				</FormHelperText>
			)}
		</Box>
	);
}
