import React from "react";

interface BootstrapInputProps {
	type?: React.HTMLInputTypeAttribute;
	autoComplete?: React.HTMLInputAutoCompleteAttribute;
	placeholder?: string;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	variant?: string;
	className?: string;
	disabled?: boolean;
}

const Input: React.FC<BootstrapInputProps> = ({ type = "text", autoComplete = "off", placeholder = "", value = "", onChange, variant = "primary", className = "", disabled }) => {
	//TODO label
	return <input type={type} autoComplete={autoComplete} placeholder={placeholder} value={value} onChange={onChange} className={`form-control border-${variant} ${className}`} disabled={disabled} />;
};
export default Input;
