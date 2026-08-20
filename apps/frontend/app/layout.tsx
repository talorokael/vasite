import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "../lib/AuthContext";
import { CartProvider } from "@/lib/CartContext";
import ToastProvider from "../components/ToastProvider";
import Navbar from "@/components/Layout/Navbar";
import { Inter, Libertinus_Serif, Lato } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { FaInstagram, FaFacebook, FaLinkedin, FaPhone } from "react-icons/fa";

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
    <footer className="bg-card border-t border-border py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Logo */}
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/images/Think Green New Logo.png"
                alt="VerdeAfrique"
                width={410}
                height={110}
                className="h-40 w-auto"
              />
            </Link>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-xs uppercase tracking-wider">
              Shop
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link
                  href="/products?category=hair"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Hair
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=body"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Body
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=face"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Face
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-xs uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  My Account
                </Link>
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

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-xs uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a
                  href="https://www.instagram.com/thinkgreen.sa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <FaInstagram className="text-sm" />
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/profile.php?id=100028366465132"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <FaFacebook className="text-sm" />
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/thinkgreen-intl0213aa42a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <FaLinkedin className="text-sm" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="tel:+270982792922"
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <FaPhone className="text-sm" />
                  087 149 0260
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-6 pt-6 text-center text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} VerdeAfrique. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}