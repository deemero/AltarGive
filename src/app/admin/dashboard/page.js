'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin')
    if (!isAdmin) window.location.href = '/admin-login'
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Semua Link sama macam kamu punya sebelum */}
        <Link href="/admin/donations">
          <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">📥 View Donations</h2>
            <p className="text-sm text-gray-500">Approve or reject user donations</p>
          </div>
        </Link>
        {/* ... dan yang lain */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="text-sm text-gray-400">Total Donations</h3>
          <p className="text-2xl font-bold">RM 12,500</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="text-sm text-gray-400">Active Campaigns</h3>
          <p className="text-2xl font-bold">8</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="text-sm text-gray-400">Pending Approval</h3>
          <p className="text-2xl font-bold">5 Donations</p>
        </div>
      </div>
    </div>
  )
}
