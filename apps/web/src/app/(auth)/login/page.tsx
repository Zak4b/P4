"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/components/AuthContext";

export default function LoginPage() {
	const { isAuthenticated } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (isAuthenticated) {
			router.replace("/play");
		}
	}, [isAuthenticated, router]);

	return <LoginForm onLogin={() => router.replace("/play")} />;
}

