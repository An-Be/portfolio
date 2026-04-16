import type { Metadata } from "next";
import { Cormorant_Garamond, Sigmar_One } from "next/font/google";
import "./globals.css";
import Cursor from "./components/Cursor";

const sigmarOne = Sigmar_One({
  variable: "--font-sigmar-one",
  weight: ["400"],
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Andrea Berrocal",
  description: "Experience Designer",
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
      className={`${sigmarOne.variable} ${cormorantGaramond.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Cursor />
        {children}
      </body>
    </html>
  );
}
