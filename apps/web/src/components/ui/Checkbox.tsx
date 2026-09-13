import { forwardRef } from "react";
import MuiCheckbox, { type CheckboxProps as MuiCheckboxProps } from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch, { type SwitchProps as MuiSwitchProps } from "@mui/material/Switch";

export type CheckboxProps = MuiCheckboxProps & { label?: string };

/**
 * Case à cocher, avec libellé optionnel intégré.
 *
 * ```tsx
 * <Checkbox label="Se souvenir de moi" checked={remember} onChange={(_, v) => setRemember(v)} />
 * ```
 */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(({ label, ...props }, ref) => {
	const control = <MuiCheckbox ref={ref} {...props} />;
	return label ? <FormControlLabel control={control} label={label} /> : control;
});
Checkbox.displayName = "Checkbox";

export type SwitchInputProps = MuiSwitchProps & { label?: string };

/**
 * Interrupteur on/off, avec libellé optionnel intégré.
 *
 * ```tsx
 * <SwitchInput label="Notifications" checked={enabled} onChange={(_, v) => setEnabled(v)} />
 * ```
 */
export const SwitchInput = forwardRef<HTMLButtonElement, SwitchInputProps>(({ label, ...props }, ref) => {
	const control = <Switch ref={ref} {...props} />;
	return label ? <FormControlLabel control={control} label={label} /> : control;
});
SwitchInput.displayName = "SwitchInput";
