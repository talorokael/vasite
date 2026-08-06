// apps/frontend/components/Layout/Navbar.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import { useState } from 'react';

const navLinks = [
  { name: 'Cosmetics', href: '/cosmetics' },
  { name: 'Flower', href: '/flower' },
  { name: 'Edible', href: '/edible' },
  { name: 'Apothecary', href: '/apothecary' },
  { name: 'About Us', href: '/about' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-card shadow-sm sticky top-0 z-50 border-b border-border">
      {/* Top row */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 hover:bg-muted rounded-md focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-foreground" />
          ) : (
            <Menu className="w-6 h-6 text-foreground" />
          )}
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <Image
            src="/va-logo.jpg"
            alt="VerdeAfrique Botanicals"
            width={180}
            height={50}
            className="h-25 w-auto"
            priority
          />
        </Link>

        {/* Icons */}
        <div className="flex items-center gap-2">
          <Link 
            href="/account" 
            className="p-2 hover:bg-muted rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Account"
          >
            <User className="w-6 h-6 text-foreground" />
            {user && (
              <span className="sr-only">Logged in as {user.email}</span>
            )}
          </Link>
          <Link 
            href="/cart" 
            className="p-2 hover:bg-muted rounded-full transition-colors relative focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={`Cart with ${cartCount} items`}
          >
            <ShoppingCart className="w-6 h-6 text-foreground" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Desktop navigation */}
      <nav className="hidden lg:block border-t border-border">
        <div className="container mx-auto px-4">
          <ul className="flex flex-wrap justify-center gap-8 py-3 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || 
                (link.href.includes('?') && pathname.includes(link.href.split('?')[0]));
              return (
                <li key={link.name}>
                    <Link
                      href={link.href}
                      className={`py-2 font-lato transition-colors hover:text-primary ${
                        isActive
                          ? 'text-primary border-b-2 border-primary'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {link.name}
                    </Link>
                </li>
              );
            })}
            {user && user.role === 'ADMIN' && (
              <li>
                <Link
                  href="/admin"
                  className={`py-2 font-lato transition-colors hover:text-primary ${pathname.startsWith('/admin') ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
                >
                  Admin
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <nav className="lg:hidden border-t border-border bg-card">
          <ul className="flex flex-col py-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 font-lato transition-colors hover:bg-muted ${
                      isActive
                        ? 'text-primary bg-secondary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
