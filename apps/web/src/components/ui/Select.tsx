import { forwardRef } from "react";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export interface SelectOption {
	value: string;
	label: string;
	disabled?: boolean;
}

export type SelectProps = Omit<TextFieldProps, "variant" | "select"> & {
	options: SelectOption[];
	placeholder?: string;
};

/**
 * Liste déroulante, construite sur `TextField select` (garde le style et la
 * validation communs à tous les champs du kit).
 *
 * ```tsx
 * <Select
 *   label="Difficulté"
 *   options={[{ value: "easy", label: "Facile" }, { value: "hard", label: "Difficile" }]}
 * />
 * ```
 */
export const Select = forwardRef<HTMLDivElement, SelectProps>(
	({ options, placeholder, slotProps, ...props }, ref) => (
		<TextField
			ref={ref}
			select
			variant="outlined"
			fullWidth
			slotProps={{
				select: { displayEmpty: Boolean(placeholder), ...slotProps?.select },
				...slotProps,
			}}
			{...props}
		>
			{placeholder && (
				<MenuItem value="" disabled>
					{placeholder}
				</MenuItem>
			)}
			{options.map((option) => (
				<MenuItem key={option.value} value={option.value} disabled={option.disabled}>
					{option.label}
				</MenuItem>
			))}
		</TextField>
	)
);
Select.displayName = "Select";
