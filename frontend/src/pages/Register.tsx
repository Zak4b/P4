import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import { useAuth } from "../components/AuthContext";

const RegisterPage: React.FC = () => {
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const location = useLocation() as any;

	useEffect(() => {
		if (isAuthenticated) {
			const redirectTo = location.state?.from?.pathname || "/";
			navigate(redirectTo, { replace: true });
		}
	}, [isAuthenticated, navigate, location.state]);

	return <RegisterForm onRegister={() => navigate("/", { replace: true })} />;
};

export default RegisterPage;
