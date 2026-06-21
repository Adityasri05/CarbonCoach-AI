import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CarbonCoach AI — Smart Carbon Tracker & Sustainability Platform",
  description: "Track, simulate, and reduce your carbon footprint with personalized AI recommendations, eco-challenges, and gamified green rewards.",
  keywords: ["sustainability", "carbon footprint", "carbon tracker", "climate change", "green points", "eco-friendly habits", "AI coaching"],
  authors: [{ name: "CarbonCoach AI Team" }],
  openGraph: {
    title: "CarbonCoach AI — Smart Carbon Tracker",
    description: "Track, simulate, and reduce your carbon footprint with personalized AI recommendations, eco-challenges, and gamified green rewards.",
    url: "https://carboncoach.ai",
    siteName: "CarbonCoach AI",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-dark-bg text-slate-100 font-sans">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
