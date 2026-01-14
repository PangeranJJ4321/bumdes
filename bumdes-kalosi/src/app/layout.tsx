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
  title: "BUMDes Kalosi - Landing Page",
  description: "Website resmi BUMDes Sumber Kalosi",
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
