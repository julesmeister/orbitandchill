import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Layout from "@/components/Layout"; // Import the Layout component
import StructuredData from "@/components/SEO/StructuredData";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { BRAND } from "@/config/brand";
import { Toaster } from "sonner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { startMemoryMonitoring } from "@/utils/memoryMonitor";
import MemoryCleanup from "@/components/MemoryCleanup";
// Memory pressure monitoring disabled - import only when needed
// import "@/utils/memoryPressure";

// Optimized to only 2 fonts for better performance

const spaceGrotesk = localFont({
  src: [
    {
      path: "../../public/fonts/Space_Grotesk/SpaceGrotesk-Regular.ttf",
      weight: "400",
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
  ],
  variable: "--font-space-grotesk",
  display: "swap",
});


const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});


export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} - Free Natal Chart Generator & Astrology Community`,
    template: `%s | ${BRAND.name}`
  },
  description: "Free natal chart calculator & astrology tools. Generate birth charts, track planetary transits, and explore your cosmic blueprint with our comprehensive astrology platform.",
  keywords: ["natal chart", "astrology", "birth chart", "horoscope", "zodiac", "planetary positions", "astrological calculator", "free birth chart", "astrological events", "planetary conjunctions", "retrograde planets", "moon phases", "astronomical events", "celestial alignments", "rare astrological events"],
  authors: [{ name: BRAND.name }],
  creator: BRAND.name,
  publisher: BRAND.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://orbitandchill.com'),
  alternates: {
    canonical: 'https://orbitandchill.com/',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'apple-touch-icon',
        url: '/apple-touch-icon.png',
        sizes: '180x180',
      },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: `${BRAND.name} - Free Natal Chart Generator & Astrological Events Tracker`,
    description: 'Generate your free natal chart and track rare astrological events in real-time. Discover your cosmic blueprint with our birth chart generator, astronomical event tracker, and astrology community.',
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
    title: `${BRAND.name} - Free Natal Chart Generator & Astrological Events Tracker`,
    description: 'Generate your free natal chart and track rare astrological events in real-time. Discover your cosmic blueprint with our astrology community.',
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
  // Memory monitoring disabled at startup - use admin panel when needed
  // if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'test') {
  //   startMemoryMonitoring(600000); // Monitor every 10 minutes
  // }

  return (
    <html lang="en">
      <head>
        <StructuredData type="website" />
        <script src="https://accounts.google.com/gsi/client" async defer></script>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </head>
      <body
        className={`${spaceGrotesk.variable} ${openSans.variable} antialiased`}
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
{/* <MemoryCleanup /> */}
      </body>
    </html>
  );
}
