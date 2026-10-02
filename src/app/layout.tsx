import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { CartProvider } from "@/components/cart-context";
import { CartDrawer } from "@/components/cart-ui";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Custodian Ark | Solar Energy & Power Solutions",
  description: "Premium solar equipment, power storage, inverters, batteries and technical energy systems for homes, businesses and commercial projects.",
  metadataBase: new URL("https://example.com"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-screen bg-mist font-sans text-slate-700 antialiased selection:bg-electric-600/20">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
