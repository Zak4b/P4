import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { Providers } from "@/components/Providers";
import "./globals.css";
import "../custom.css";

export const metadata: Metadata = {
	title: "P4 Game",
	description: "Puissance 4 Online Game",
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon.ico",
		apple: "/favicon.ico",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fr" suppressHydrationWarning>
			<body>
				<InitColorSchemeScript defaultMode="system" />
				<AppRouterCacheProvider options={{ key: "mui" }}>
					<Providers>{children}</Providers>
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}
