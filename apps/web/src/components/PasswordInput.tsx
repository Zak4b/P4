import { useState } from "react";
import { TextField, InputAdornment, IconButton, TextFieldProps, FormHelperText, Box } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export type ValidationRule = [(value: string) => boolean, string];

type PasswordInputProps = Omit<TextFieldProps, "helperText"> & {
	validations?: ValidationRule[];
};

export default function PasswordInput({
	slotProps,
	validations,
	value,
	...props
}: PasswordInputProps) {
	const [show, setShow] = useState(false);
	const stringValue = typeof value === "string" ? value : "";

	const validationMessages = validations?.map(([validator, message]) => ({
		message,
		isValid: validator(stringValue),
	})) || [];

	const hasErrors = validationMessages.some((v) => !v.isValid);

	return (
		<Box>
			<TextField
				{...props}
				value={value}
				type={show ? "text" : "password"}
				error={props.error || (hasErrors && stringValue.length > 0)}
				slotProps={{
					...slotProps,
					input: {
						...slotProps?.input,
						endAdornment: (
							<InputAdornment position="end">
								<IconButton onClick={() => setShow((prev) => !prev)} edge="end">
									{show ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						),
					},
				}}
			/>
			{validationMessages.length > 0 && (
				<Box sx={{ mt: 0.5 }}>
					{validationMessages.map((validation, index) => (
						<FormHelperText
							key={index}
							error={!validation.isValid}
							sx={{
								color: validation.isValid ? "success.main" : "error.main",
								m: 0,
								mx: 1.75,
							}}
						>
							{validation.message}
						</FormHelperText>
					))}
				</Box>
			)}
		</Box>
	);
}

