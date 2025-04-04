'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function AdminDashboard() {
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin')
    if (!isAdmin) window.location.href = '/admin-login'
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    window.location.href = '/'
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📊 Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <Link href="/admin/donations">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow hover:shadow-lg cursor-pointer">
            <h2 className="text-xl font-bold mb-2">📥 View Donations</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Approve or reject user donations</p>
          </div>
        </Link>

        <Link href="/admin/campaigns">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow hover:shadow-lg cursor-pointer">
            <h2 className="text-xl font-bold mb-2">📂 All Campaigns</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">View and manage existing campaigns</p>
          </div>
        </Link>

        <Link href="/campaigns-create">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow hover:shadow-lg cursor-pointer">
            <h2 className="text-xl font-bold mb-2">➕ Create Campaign</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Start a new campaign for donations</p>
          </div>
        </Link>

        <Link href="/">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow hover:shadow-lg cursor-pointer">
            <h2 className="text-xl font-bold mb-2">🏠 Back to Home</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Return to public homepage</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
