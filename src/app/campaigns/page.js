'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([])

  useEffect(() => {
    const fetchCampaigns = async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('start_date', { ascending: false })

      if (error) console.error('Error:', error)
      else setCampaigns(data)
    }

    fetchCampaigns()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Campaigns</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((c) => (
          <div key={c.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
            <img src={c.image_url} alt={c.title} className="rounded-xl h-40 w-full object-cover mb-4" />
            <h2 className="text-xl font-semibold">{c.title}</h2>
            <p className="text-sm text-gray-500">{c.description?.slice(0, 100)}...</p>
            <div className="my-2 text-sm">
              📅 {c.start_date} → {c.end_date}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${(c.current_amount / c.target_amount) * 100}%` }}
              />
            </div>
            <div className="text-sm mb-2">
              RM {c.current_amount} / RM {c.target_amount}
            </div>
            <Link href={`/campaigns/${c.id}`}>
              <button className="bg-blue-600 text-white rounded-xl px-4 py-2 w-full hover:bg-blue-700">
                View Details
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
