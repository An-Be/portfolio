import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Cursor from "./components/Cursor";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

const SITE_DESCRIPTION =
  "I make complex products legible, to buyers, sellers, and everyone in between.";

export const metadata: Metadata = {
  metadataBase: new URL("https://andreaberrocal.com"),
  title: {
    default: "Andrea Berrocal",
    template: "%s | Andrea Berrocal",
  },
  description: SITE_DESCRIPTION,
  // Link-preview image comes from app/opengraph-image.png and
  // app/twitter-image.png (Next.js file conventions).
  openGraph: {
    type: "website",
    siteName: "Andrea Berrocal",
    title: "Andrea Berrocal",
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Andrea Berrocal",
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: "/images/icon.svg",
    shortcut: "/images/icon.svg",
    apple: "/images/icon.svg",
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
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Cursor />
        {children}
      </body>
    </html>
  );
}
