import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { useAuth } from "../components/AuthContext";

const LoginPage: React.FC = () => {
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const location = useLocation() as any;

	useEffect(() => {
		if (isAuthenticated) {
			const redirectTo = location.state?.from?.pathname || "/";
			navigate(redirectTo, { replace: true });
		}
	}, [isAuthenticated, navigate, location.state]);

	return (
		<div className="container py-4">
			<LoginForm onLogin={() => navigate("/", { replace: true })} />
		</div>
	);
};

export default LoginPage;
