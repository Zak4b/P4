import { Box, Stack } from "@mui/material";
import { Muted, Panel, Text } from "@/components/ui";

interface SettingsSectionProps {
	title: string;
	description: string;
	children: React.ReactNode;
}

/** Une section de réglages : le libellé et son explication à gauche, les champs à droite. */
export default function SettingsSection({ title, description, children }: SettingsSectionProps) {
	return (
		<Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "240px 1fr" }, gap: { xs: 1.5, md: 4 } }}>
			<Box sx={{ pt: { md: 2.5 } }}>
				<Text sx={{ fontWeight: 600 }}>{title}</Text>
				<Muted sx={{ mt: 0.5 }}>{description}</Muted>
			</Box>
			<Panel sx={{ p: 3 }}>
				<Stack spacing={2.5}>{children}</Stack>
			</Panel>
		</Box>
	);
}
