import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionSyncer from "@/components/SessionSyncer";
import { SessionProvider } from "@/lib/SessionContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rowllr - Share Your Stories with the World",
  description: "Earn 100% from your writing. Build a community of dedicated readers. Get paid from day one—no hidden fees, no compromises.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <Suspense fallback={null}>
            <SessionSyncer />
          </Suspense>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
