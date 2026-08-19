import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "../lib/AuthContext";
import { CartProvider } from "@/lib/CartContext";
import ToastProvider from "../components/ToastProvider";
import Navbar from "@/components/Layout/Navbar";
import { Inter, Libertinus_Serif, Lato } from "next/font/google";
import Link from "next/link";
import Image from "next/image";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const libertinus = Libertinus_Serif({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-libertinus",
});
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: {
    default: "VerdeAfrique | Natural African Beauty & Wellness",
    template: "%s | VerdeAfrique",
  },
  description:
    "Discover premium skincare, body, and beauty products inspired by African botanicals. Pure ingredients, sustainable sourcing, transformative results.",
  keywords: [
    "African skincare",
    "natural beauty",
    "botanical products",
    "wellness",
    "sustainable beauty",
  ],
};

export const viewport: Viewport = {
  themeColor: "#004236",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${libertinus.variable} ${lato.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <div className="min-h-screen">{children}</div>
            <Footer />
            <ToastProvider />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/images/Think Green New Logo.png"
                alt="VerdeAfrique"
                width={410}
                height={110}
                className="h-50 w-auto"
              />
            </Link>
            
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/products?category=hair"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Hair
                </a>
              </li>
              <li>
                <a
                  href="/products?category=body"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Body
                </a>
              </li>
              <li>
                <a
                  href="/products?category=face"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Face
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  All Products
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/account"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  My Account
                </a>
              </li>
              <li>
                <Link
                  href="/account/orders"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-muted-foreground">
                  help@verdeafrique.com
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} VerdeAfrique. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
