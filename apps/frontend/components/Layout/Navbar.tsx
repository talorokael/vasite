// apps/frontend/components/Layout/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';

const navLinks = [
  { name: 'Hair', href: '/products?category=hair' },
  { name: 'Body', href: '/products?category=body' },
  { name: 'Face', href: '/products?category=face' },
  { name: 'Flower', href: '/products?category=flower' },
  { name: 'Edible', href: '/products?category=edible' },
  { name: 'Apothecary', href: '/products?category=apothecary' },
  { name: 'About Us', href: '/about' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top row */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="w-14" />
        <Link href="/" className="text-2xl font-bold text-green-700">
          VerdeAfrique
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/account" className="p-2 hover:bg-gray-100 rounded-full">
            <UserIcon className="w-6 h-6 text-gray-700" />
          </Link>
          <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full">
            <ShoppingCartIcon className="w-6 h-6 text-gray-700" />
          </Link>
        </div>
      </div>

      {/* Bottom navigation */}
      <nav className="border-t border-gray-200">
        <div className="container mx-auto px-4">
          <ul className="flex flex-wrap justify-center gap-6 py-3 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`hover:text-green-600 ${
                    pathname === link.href
                      ? 'text-green-700 border-b-2 border-green-500'
                      : 'text-gray-600'
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}