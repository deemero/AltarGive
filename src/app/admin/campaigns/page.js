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

      if (error) console.error('Error fetching campaigns:', error)
      else setCampaigns(data)
    }

    fetchCampaigns()
  }, [])

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this campaign?')
    if (!confirm) return

    const { error } = await supabase.from('campaigns').delete().eq('id', id)

    if (error) {
      alert('Error deleting campaign')
    } else {
      setCampaigns((prev) => prev.filter((c) => c.id !== id))
    }
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Admin: All Campaigns</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((c) => (
          <div
            key={c.id}
            className="bg-white shadow-lg p-6 rounded-xl space-y-4 hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-800">{c.title}</h2>
            <p className="text-sm text-gray-500">{c.description}</p>

            <div className="text-sm text-gray-600">
              📅 {c.start_date} → {c.end_date}
            </div>

            <div className="text-gray-700 font-semibold">
              RM {c.current_amount} / RM {c.target_amount}
            </div>

            <div className="flex gap-3">
              <Link
                href={`/campaigns/${c.id}`}
                className="text-indigo-500 hover:text-indigo-700 font-medium"
              >
                View
              </Link>
              <button
                onClick={() => handleDelete(c.id)}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
