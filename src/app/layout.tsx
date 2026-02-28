import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";

import Breadcrumbs from "@/components/Breadcrumbs";
import Navigation from "@/components/Navigation";

import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "MetaForge | Gaming Build Optimization",
    template: "%s | MetaForge",
  },
  description:
    "MetaForge helps you browse and calculate optimized Helldivers 2 and Borderlands 4 builds with real-time recommendations.",
  keywords: ["Helldivers 2", "Borderlands 4", "build calculator", "gaming builds", "MetaForge"],
  openGraph: {
    title: "MetaForge",
    description: "Build browsing and calculators for Helldivers 2 and Borderlands 4.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MetaForge",
    description: "Build browsing and calculators for Helldivers 2 and Borderlands 4.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${orbitron.variable} ${rajdhani.variable} bg-slate-950 text-slate-100 antialiased`}>
        <div className="min-h-screen bg-grid">
          <Navigation />
          <Breadcrumbs />
          <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
