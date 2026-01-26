import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '../lib/AuthContext';

export const metadata: Metadata = {
  title: "VerdeAfrique",
  description: "Premium cannabis products for wellness and recreation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider> {/* Wrap with AuthProvider */}
          {children}
        </AuthProvider>

      </body>
    </html>
  );
}