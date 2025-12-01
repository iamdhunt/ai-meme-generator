import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { APP_URL, APP_NAME, APP_DESCRIPTION } from "@/config/share-config";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

export const metadata: Metadata = {
  title: `${APP_NAME} ✱ Culture-Coded Chaos.`,
  description: APP_DESCRIPTION,
  metadataBase: new URL(APP_URL),
  keywords: [
    "AI meme generator",
    "meme maker",
    "funny memes",
    "AI caption tool",
    "viral memes",
    "internet humor",
    "meme templates",
    "instant meme generator",
  ],
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: APP_URL,
    siteName: APP_NAME,
    type: "website",
    images: [
      {
        url: `${APP_URL}/imm-image.png`,
        width: 1024,
        height: 1024,
        alt: `${APP_NAME} ✱ Culture-Coded Chaos.`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [`${APP_URL}/imm-image.png`],
  },
  alternates: {
    canonical: APP_URL,
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="max-w-[1440px] mx-auto">{children}</div>
      </body>
    </html>
  );
}
