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
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800"> Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/donations">
          <div className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition duration-300">
            <h2 className="text-xl font-semibold">📥 View Donations</h2>
            <p className="text-gray-500 mt-2">Approve or reject user donations</p>
          </div>
        </Link>

        <Link href="/admin/campaigns">
          <div className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition duration-300">
            <h2 className="text-xl font-semibold">📂 All Campaigns</h2>
            <p className="text-gray-500 mt-2">View and manage existing campaigns</p>
          </div>
        </Link>

        <Link href="/campaigns-create">
          <div className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition duration-300">
            <h2 className="text-xl font-semibold">➕ Create Campaign</h2>
            <p className="text-gray-500 mt-2">Start a new campaign for donations</p>
          </div>
        </Link>

        <Link href="/">
          <div className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition duration-300">
            <h2 className="text-xl font-semibold">🏠 Back to Home</h2>
            <p className="text-gray-500 mt-2">Return to public homepage</p>
          </div>
        </Link>
      </div>

      {/* Statistik Contoh */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-sm text-gray-400">Total Donations</h3>
          <p className="text-2xl font-bold">RM 12,500</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-sm text-gray-400">Active Campaigns</h3>
          <p className="text-2xl font-bold">8</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-sm text-gray-400">Pending Approval</h3>
          <p className="text-2xl font-bold">5 Donations</p>
        </div>
      </div>
    </div>
  )
}
