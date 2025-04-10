'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState([])

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin')
    if (!isAdmin) window.location.href = '/admin-login'

    const fetchCampaigns = async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('start_date', { ascending: false })

      if (!error) setCampaigns(data || [])
    }

    fetchCampaigns()
  }, [])

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this campaign?')
    if (!confirm) return

    const { error } = await supabase.from('campaigns').delete().eq('id', id)

    if (!error) {
      setCampaigns((prev) => prev.filter((c) => c.id !== id))
    } else {
      alert('Error deleting campaign')
    }
  }

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">All Campaigns</h1>
        
      </div>

      {/* Responsive: Table on desktop, cards on mobile */}
      <div className="hidden md:block overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Progress</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 text-sm">
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-6">
                  No campaigns found.
                </td>
              </tr>
            ) : (
              campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-900">{c.title}</td>
                  <td className="px-4 py-3 text-gray-600 text-sm">
                    {c.start_date} → {c.end_date}
                  </td>
                  <td className="px-4 py-3 text-gray-800 font-semibold">
                    RM {c.current_amount} / RM {c.target_amount}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{c.description}</td>
                  <td className="px-4 py-3 space-x-3 whitespace-nowrap">
                    <Link href={`/campaigns/${c.id}`} className="text-blue-600 hover:underline">View</Link>
                    <Link href={`/admin/edit-campaigns/${c.id}`} className="text-yellow-500 hover:underline">✏️ Edit</Link>
                    <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Version (Card layout) */}
      <div className="block md:hidden space-y-4">
        {campaigns.map((c) => (
          <div key={c.id} className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold text-gray-800">{c.title}</h2>
            <p className="text-sm text-gray-500 mb-1">📅 {c.start_date} → {c.end_date}</p>
            <p className="text-sm text-gray-700 font-semibold">
              RM {c.current_amount} / RM {c.target_amount}
            </p>
            <p className="text-sm text-gray-600 mt-1">{c.description}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link href={`/campaigns/${c.id}`} className="text-blue-600 text-sm underline">View</Link>
              <Link href={`/admin/edit-campaigns/${c.id}`} className="text-yellow-500 text-sm underline">✏️ Edit</Link>
              <button onClick={() => handleDelete(c.id)} className="text-red-500 text-sm underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
