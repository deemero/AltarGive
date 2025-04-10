'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Donations', href: '/admin/donations' },
    { name: 'Campaigns', href: '/admin/campaigns' },
    { name: 'Create', href: '/campaigns-create' },
    { name: 'Payments', href: '/admin/payments' },
    { name: 'Logout', href: '/', action: () => localStorage.removeItem('isAdmin') },
  ]

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Mobile Topbar */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 bg-white shadow md:hidden">
          <h1 className="text-lg font-bold text-purple-700">AltarGive Admin</h1>
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="text-purple-700" />
          </button>
        </div>
      )}

      {/* Overlay when sidebar open */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            ${isMobile ? 'fixed inset-0 z-40 w-64 overflow-y-auto' : 'w-64 h-screen fixed'}
            bg-gradient-to-br from-purple-600 to-pink-500 text-white p-6 space-y-4
            transition-transform duration-300
            ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          `}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">AltarGive Admin</h1>
            {isMobile && (
              <button onClick={() => setSidebarOpen(false)}>
                <X className="text-white" />
              </button>
            )}
          </div>

          {navItems.map((item, idx) =>
            item.name === 'Logout' ? (
              <button
                key={idx}
                onClick={() => {
                  item.action()
                  window.location.href = item.href
                }}
                className="block w-full text-left px-4 py-2 rounded hover:bg-white hover:text-purple-700 font-medium transition"
              >
                🚪 {item.name}
              </button>
            ) : (
              <Link
                key={idx}
                href={item.href}
                className={`block px-4 py-2 rounded hover:bg-white hover:text-purple-700 transition ${
                  pathname === item.href ? 'bg-white text-purple-700 font-bold' : ''
                }`}
              >
                {item.name}
              </Link>
            )
          )}
        </aside>

        {/* Main Content */}
        <main className={`flex-1 p-6 transition-all duration-300 ${isMobile ? 'ml-0' : 'ml-64'}`}>
          {children}
        </main>
      </div>
    </div>
  )
}
