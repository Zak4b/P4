import type { Metadata } from "next";
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
    <html lang="fr">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
