// apps/frontend/components/Layout/Navbar.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="font-bold text-2xl text-green-700">VerdeAfrique</div>
          
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-green-600">Products</Link>
            <a href="#" className="text-gray-700 hover:text-green-600">Categories</a>
            <a href="#" className="text-gray-700 hover:text-green-600">About</a>
            <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}