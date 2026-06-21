import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import SkipNav from "@/components/SkipNav";
import ErrorBoundaryWrapper from "@/components/ErrorBoundaryWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CarbonCoach AI — Smart Carbon Tracker & Sustainability Platform",
  description: "Track, simulate, and reduce your carbon footprint with personalized AI recommendations powered by Google Gemini, eco-challenges, and gamified green rewards. Built with Firebase & Next.js.",
  keywords: ["sustainability", "carbon footprint", "carbon tracker", "climate change", "green points", "eco-friendly habits", "AI coaching", "Google Gemini", "Firebase"],
  authors: [{ name: "CarbonCoach AI Team" }],
  robots: "index, follow",
  openGraph: {
    title: "CarbonCoach AI — Smart Carbon Tracker",
    description: "Track, simulate, and reduce your carbon footprint with personalized AI recommendations, eco-challenges, and gamified green rewards.",
    url: "https://carboncoach-ai-pro.web.app",
    siteName: "CarbonCoach AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CarbonCoach AI — Smart Carbon Tracker",
    description: "Track, simulate, and reduce your carbon footprint with AI-powered sustainability coaching.",
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
      <head>
        {/* Performance: Preconnect to key origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://generativelanguage.googleapis.com" />
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link rel="dns-prefetch" href="https://identitytoolkit.googleapis.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

        {/* Security headers via meta tags */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body className="min-h-full flex flex-col bg-dark-bg text-slate-100 font-sans">
        <SkipNav />
        <AppProvider>
          <ErrorBoundaryWrapper>
            {children}
          </ErrorBoundaryWrapper>
        </AppProvider>
      </body>
    </html>
  );
}
