// apps/frontend/components/Layout/Navbar.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import { useState } from 'react';

const navLinks = [
  { name: 'Cosmetics', href: '/cosmetics' },
  { name: 'Flower', href: '/flower' },
  { name: 'Edible', href: '/edible' },
  { name: 'Apothecary', href: '/apothecary' },
  { name: 'Consulting', href: '/consulting' },
  { name: 'Training', href: '/training' },
  { name: 'About Us', href: '/about' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-card shadow-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between relative">
        {/* Left: Hamburger button – stays above overlay */}
        <button
  onClick={toggleMenu}
  className="relative z-50 p-2 hover:bg-muted rounded-md focus-visible:ring-2 focus-visible:ring-primary transition-colors group"
  aria-label={isOpen ? 'Close menu' : 'Open menu'}
>
  <div className="w-8 h-8 flex flex-col items-center justify-center gap-1.5 overflow-visible">
    <span
      className={`
        block w-6 h-0.5 bg-foreground rounded-full transition-all duration-300 origin-center
        ${isOpen ? 'rotate-45 translate-y-2' : ''}
      `}
    />
    <span
      className={`
        block w-6 h-0.5 bg-foreground rounded-full transition-all duration-300
        ${isOpen ? 'opacity-0' : ''}
      `}
    />
    <span
      className={`
        block w-6 h-0.5 bg-foreground rounded-full transition-all duration-300 origin-center
        ${isOpen ? '-rotate-45 -translate-y-2' : ''}
      `}
    />
  </div>
</button>

        {/* Center: Logo */}
        <Link href="/" className="flex items-center" onClick={closeMenu}>
          <Image
            src="/va-logo.jpg"
            alt="VerdeAfrique Botanicals"
            width={180}
            height={50}
            className="h-20 w-auto"
            priority
          />
        </Link>

        {/* Right: User & Cart icons */}
        <div className="flex items-center gap-2">
          <Link
            href="/account"
            className="p-2 hover:bg-muted rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Account"
          >
            <User className="w-6 h-6 text-foreground" />
            {user && <span className="sr-only">Logged in as {user.email}</span>}
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

      {/* Full-screen overlay – now with pointer-events-auto and z-40 */}
      <div
        className={`
          fixed inset-0 z-40 bg-background/95 backdrop-blur-sm transition-all duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        onClick={closeMenu} // optional: click outside to close
      >
        <nav className="h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <ul className="flex flex-col items-center gap-8 text-2xl font-serif text-foreground">
            {navLinks.map((link) => {
              const isActive = pathname === link.href ||
                (link.href.includes('?') && pathname.includes(link.href.split('?')[0]));
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className={`
                      hover:text-primary transition-colors
                      ${isActive ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}
                    `}
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
                  onClick={closeMenu}
                  className={`
                    hover:text-primary transition-colors
                    ${pathname.startsWith('/admin') ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}
                  `}
                >
                  Admin
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}