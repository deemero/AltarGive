'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)  // Toggle the menu state
  }

  return (
    <header className="bg-white shadow-md w-full px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="bg-purple-600 p-2 rounded-full text-white font-bold text-sm">💖</div>
          <span className="font-semibold text-lg text-gray-800">AltarGive</span>
        </div>

        {/* Navigation for Desktop */}
        <nav className="hidden md:flex space-x-6 text-sm text-gray-600">
          <Link href="/admin/dashboard" className="hover:text-purple-600 font-medium">
            Dashboard
          </Link>
          <Link href="/campaigns" className="hover:text-purple-600">
            Campaigns
          </Link>
          <Link href="#" className="hover:text-purple-600">
            Schedule
          </Link>
          <Link href="#" className="hover:text-purple-600">
            Reports
          </Link>
          <Link href="#" className="hover:text-purple-600">
            Documents
          </Link>
          <Link href="#" className="hover:text-purple-600">
            Messages
          </Link>
        </nav>

        {/* Right section for Desktop */}
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search"
            className="hidden md:block px-3 py-1 rounded-lg border border-gray-300 text-sm"
          />

          {/* Avatar or Name */}
          <div className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
            Nero
          </div>

          {/* Buttons for Desktop */}
          <div className="space-x-2 hidden md:block">
            <Link href="/admin-login">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded">
                Sign Up
              </button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button (Hamburger) */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex items-center space-x-2 text-gray-600 hover:text-purple-600"
        >
          <span className="material-icons">menu</span> {/* Material Icon for hamburger */}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="md:hidden flex flex-col items-center space-y-4 text-sm text-gray-600 mt-4">
          <Link href="/admin/dashboard" className="hover:text-purple-600 font-medium">
            Dashboard
          </Link>
          <Link href="/campaigns" className="hover:text-purple-600">
            Campaigns
          </Link>
          <Link href="#" className="hover:text-purple-600">
            Schedule
          </Link>
          <Link href="#" className="hover:text-purple-600">
            Reports
          </Link>
          <Link href="#" className="hover:text-purple-600">
            Documents
          </Link>
          <Link href="#" className="hover:text-purple-600">
            Messages
          </Link>
        </nav>
      )}
    </header>
  )
}
