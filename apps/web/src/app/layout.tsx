import type { Metadata } from "next";
import { Jost } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { Providers } from "@/components/Providers";
import "./globals.css";
import "../custom.css";

const jost = Jost({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-jost",
	display: "swap",
});

export const metadata: Metadata = {
	title: "P4 · Puissance 4 en ligne",
	description: "Puissance 4 en ligne",
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
		<html lang="fr" className={jost.variable} suppressHydrationWarning>
			<body>
				<InitColorSchemeScript defaultMode="system" />
				<AppRouterCacheProvider options={{ key: "mui" }}>
					<Providers>{children}</Providers>
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}
