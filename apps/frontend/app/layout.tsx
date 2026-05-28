import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../lib/AuthContext";
import { CartProvider } from "@/lib/CartContext";
import ToastProvider from "../components/ToastProvider";
import Navbar from "@/components/Layout/Navbar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VerdeAfrique",
  description: "Premium cannabis products for wellness and recreation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            {children}
            <ToastProvider />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}