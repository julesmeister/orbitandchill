import type { Metadata } from "next";
import { Geist, Geist_Mono, Epilogue, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Layout from "@/components/Layout"; // Import the Layout component
import StructuredData from "@/components/SEO/StructuredData";
import { BRAND } from "@/config/brand";
import { Toaster } from "sonner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { startMemoryMonitoring } from "@/utils/memoryMonitor";
import MemoryCleanup from "@/components/MemoryCleanup";
// Import memory pressure manager to enable emergency cleanup at 97.5% heap usage
import "@/utils/memoryPressure";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Synapsas fonts
const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const spaceGrotesk = localFont({
  src: [
    {
      path: "../../public/fonts/Space_Grotesk/SpaceGrotesk-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Space_Grotesk/SpaceGrotesk-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Space_Grotesk/SpaceGrotesk-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Space_Grotesk/SpaceGrotesk-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Space_Grotesk/SpaceGrotesk-Light.ttf",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const arvo = localFont({
  src: [
    {
      path: "../../public/fonts/Arvo/Arvo-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Arvo/Arvo-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Arvo/Arvo-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/Arvo/Arvo-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-arvo",
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} - Free Natal Chart Generator & Astrology Community`,
    template: `%s | ${BRAND.name}`
  },
  description: "Generate your free natal chart and discover your cosmic blueprint. Join our astrology community to explore birth charts, planetary transits, and astrological insights.",
  keywords: ["natal chart", "astrology", "birth chart", "horoscope", "zodiac", "planetary positions", "astrological calculator", "free birth chart"],
  authors: [{ name: BRAND.name }],
  creator: BRAND.name,
  publisher: BRAND.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://orbit-and-chill.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: `${BRAND.name} - Free Natal Chart Generator & Astrology Community`,
    description: 'Generate your free natal chart and discover your cosmic blueprint. Join our astrology community to explore birth charts, planetary transits, and astrological insights.',
    siteName: BRAND.name,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${BRAND.name} - Free Natal Chart Generator`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND.name} - Free Natal Chart Generator & Astrology Community`,
    description: 'Generate your free natal chart and discover your cosmic blueprint. Join our astrology community.',
    images: ['/twitter-image.jpg'],
    creator: '@orbit-and-chill',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Start memory monitoring in production and development (singleton prevents duplicates)
  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'test') {
    startMemoryMonitoring(600000); // Monitor every 10 minutes (reduced from 5 minutes)
  }

  return (
    <html lang="en">
      <head>
        <StructuredData type="website" />
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${arvo.variable} ${epilogue.variable} ${spaceGrotesk.variable} ${inter.variable} antialiased`}
      >
        <ErrorBoundary>
          <Layout>{children}</Layout> {/* Wrap children with Layout */}
        </ErrorBoundary>
        <Toaster 
          position="bottom-right"
          richColors
          closeButton
          duration={5000}
        />
        <MemoryCleanup />
      </body>
    </html>
  );
}
