import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AppProviders } from "@/components/providers/app-providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProcureFlow - Enterprise Procurement SaaS",
  description: "Modern procurement management platform with vendor management, purchasing, invoicing, and analytics. Built for efficiency and compliance.",
  keywords: ["Procurement", "SaaS", "Vendor Management", "Purchase Orders", "Invoicing", "Analytics", "Enterprise"],
  authors: [{ name: "ProcureFlow Team" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "ProcureFlow - Enterprise Procurement SaaS",
    description: "Streamline your procurement process with our comprehensive SaaS platform",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProcureFlow - Enterprise Procurement SaaS",
    description: "Streamline your procurement process with our comprehensive SaaS platform",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AppProviders>
          {children}
        </AppProviders>
        <Toaster />
      </body>
    </html>
  );
}
