"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import RegisterForm from "@/components/RegisterForm";
import { useAuth } from "@/components/AuthContext";

export default function RegisterPage() {
	const { isAuthenticated } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (isAuthenticated) {
			router.replace("/");
		}
	}, [isAuthenticated, router]);

	return <RegisterForm onRegister={() => router.replace("/")} />;
}

