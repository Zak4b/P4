"use client";

import { Stack, Container } from "@mui/material";
import { PageHeader } from "@/components/ui";
import { useAuth } from "@/components/AuthContext";
import UsernameSection from "@/components/settings/UsernameSection";
import EmailSection from "@/components/settings/EmailSection";
import PasswordSection from "@/components/settings/PasswordSection";

export default function SettingsPage() {
	const { user } = useAuth();

	return (
		<Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
			<PageHeader title="Paramètres" finding="Les informations de connexion de ton compte." />

			<Stack spacing={4} data-motion="" sx={{ animation: "riseIn 420ms var(--ease-out) 60ms both" }}>
				{user && <UsernameSection currentUsername={user.username} />}
				{user && <EmailSection currentEmail={user.email} />}
				<PasswordSection />
			</Stack>
		</Container>
	);
}
