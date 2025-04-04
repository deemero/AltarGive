'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md px-6 py-3 flex justify-between items-center">
      <div className="text-xl font-bold text-purple-600">AltarGive</div>

      <div className="flex gap-6 items-center text-sm">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/" className="hover:underline">News</Link>
        <Link href="/admin/dashboard">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl">
            Admin Page
          </button>
        </Link>
      </div>
    </nav>
  )
}
