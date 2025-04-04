'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function Home() {
  const [campaigns, setCampaigns] = useState([])

  useEffect(() => {
    const fetchCampaigns = async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('start_date', { ascending: false })
        .limit(3)

      if (error) console.error('Error:', error)
      else setCampaigns(data)
    }

    fetchCampaigns()
  }, [])

  return (
    <div className="p-6 space-y-12">
      {/* HERO SECTION */}
      <section className="text-center py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold mb-4">Give with Purpose</h1>
        <p className="text-lg mb-6">Support impactful campaigns around you.</p>
        <Link href="/campaigns">
          <button className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition">
            Explore Campaigns
          </button>
        </Link>
      </section>

      {/* LATEST CAMPAIGNS */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Latest Campaigns</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {campaigns.map((c) => (
            <div key={c.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
              <img
                src={c.image_url}
                alt={c.title}
                className="rounded-xl h-40 w-full object-cover mb-4"
              />
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="text-sm text-gray-500">{c.description?.slice(0, 80)}...</p>
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
      </section>
    </div>
  )
}
