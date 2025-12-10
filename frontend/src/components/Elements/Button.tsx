interface ButtonProps {
	variant?: string;
	children?: React.ReactNode;
	className?: string;
	disabled?: boolean;
	name?: string;
	type?: "button" | "submit" | "reset";
	onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ variant = "primary", children, className = "", disabled = false, name, type, onClick = () => {} }) => (
	<button className={`btn btn-${variant} ${className}`} disabled={disabled} name={name} type={type} onClick={onClick}>
		{children}
	</button>
);
export default Button;
