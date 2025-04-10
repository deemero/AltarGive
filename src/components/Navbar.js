"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-white shadow-sm w-full px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="font-bold text-xl text-blue-600">
          AltarGive
        </div>

        {/* Navigation for Desktop */}
        <nav className="hidden md:flex space-x-8 text-gray-600 font-medium">
          <Link href="/" className="hover:text-blue-600">
            Campaigns
          </Link>
          <Link href="#" className="hover:text-blue-600">
          News
          </Link>
          <Link href="#" className="hover:text-blue-600">
          About us
          </Link>
          <Link href="#" className="hover:text-blue-600">
            Pmmr
          </Link>
          <Link href="/login" className="hover:text-blue-600">
            User Login
          </Link>
        </nav>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search"
            className="hidden md:block px-3 py-1 border rounded-md text-sm border-gray-300"
          />

          <div className="hidden md:block text-sm font-medium text-gray-600">
            Search
          </div>

          <Link href="/admin-login">
            <button className="hidden md:block bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700">
              Admin Page
            </button>
          </Link>

          {/* Mobile menu button */}
          <button onClick={toggleMenu} className="md:hidden text-gray-600 hover:text-blue-600">
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden flex flex-col items-center space-y-4 text-gray-600 font-medium mt-4">
          <Link href="/" className="hover:text-blue-600">
            Campaigns
          </Link>
          <Link href="#" className="hover:text-blue-600">
            News
          </Link>
          <Link href="#" className="hover:text-blue-600">
          About us
          </Link>
          <Link href="#" className="hover:text-blue-600">
            Pmmr
          </Link>
          <Link href="/login" className="hover:text-blue-600">
            User Login
          </Link>

          <input
            type="text"
            placeholder="Search"
            className="px-3 py-1 border rounded-md text-sm border-gray-300"
          />

          <div className="text-sm font-medium text-gray-600">
            Search
          </div>

          <Link href="/admin-login">
            <button className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700">
              Admin Page
            </button>
          </Link>
        </nav>
      )}
    </header>
  );
}