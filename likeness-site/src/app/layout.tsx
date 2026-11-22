import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { BASE_PATH, SITE_ORIGIN, ogImage } from "@/lib/base";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "LIKENESS · TAPE 03 — a psychological chamber horror about identity, memory, and the doppelgänger you can almost trust. A man wakes with a wound, three tapes, and a voice in the next room that is his own. Omnia Vanitas Studios. Characters: THOREAU, DRYA.";

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_ORIGIN}${BASE_PATH}`),
  title: "LIKENESS : THE GAME — Tape 03",
  description,
  openGraph: {
    title: "LIKENESS : THE GAME — Tape 03",
    description,
    siteName: "LIKENESS Universe — OVS",
    type: "website",
    images: [{ url: ogImage("/og/home.jpg"), width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LIKENESS : THE GAME — Tape 03",
    description,
    images: [ogImage("/og/home.jpg")],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
