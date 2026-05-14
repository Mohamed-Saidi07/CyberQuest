import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "CyberQuest - Interactive Cybersecurity Learning Platform",
  description:
    "Master cybersecurity through gamified challenges. Learn password security, phishing detection, network safety, and more through interactive scenarios.",
  generator: "v0.app",
};

export const viewport: Viewport = {
  themeColor: "#0a0e1a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <body className="font-sans antialiased min-h-screen bg-background text-foreground">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
