import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/lib/trpc/react";
import { AOSProvider } from "@/components/providers/AOSProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { Toaster } from "@/components/ui/sonner";
import { WhatsAppButton } from "@/components/custom/WhatsappButton";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bumdessumberkalosi.com"),
  title: {
    default: "BUMDes Sumber Kalosi",
    template: "%s | BUMDes Sumber Kalosi",
  },
  description: "Website resmi BUMDes Sumber Kalosi. Melayani masyarakat dengan inovasi digital dan layanan terbaik.",
  openGraph: {
    title: "BUMDes Sumber Kalosi",
    description: "Website resmi BUMDes Sumber Kalosi. Melayani masyarakat dengan inovasi digital dan layanan terbaik.",
    url: "https://bumdessumberkalosi.com",
    siteName: "BUMDes Sumber Kalosi",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/logo-sidrap.png",
        width: 1200, // Note: Logo might be smaller, but this tag suggests preferred display size
        height: 630,
        alt: "BUMDes Sumber Kalosi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BUMDes Sumber Kalosi",
    description: "Website resmi BUMDes Sumber Kalosi",
    images: ["/logo-sidrap.png"],
  },
  icons: {
    icon: "/logo-sidrap.png",
    shortcut: "/logo-sidrap.png",
    apple: "/logo-sidrap.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
          <TRPCReactProvider>
            <CartProvider>
              <AOSProvider>{children}</AOSProvider>
              <WhatsAppButton phoneNumber="6282393318287" message="Halo Admin BUMDes Kalosi, saya butuh bantuan..." />
              <Toaster />
            </CartProvider>
          </TRPCReactProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
