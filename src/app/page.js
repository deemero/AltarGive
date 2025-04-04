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
        .limit(4)

      if (error) console.error('Error:', error)
      else setCampaigns(data)
    }

    fetchCampaigns()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-12">
      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Do fundraise now"
          className="bg-white px-4 py-2 rounded-full border border-gray-300 w-full max-w-sm shadow-sm focus:outline-none"
        />
       <Link href="/admin/dashboard">
  <button className="ml-4 bg-red-600 text-white px-6 py-2 rounded-full shadow hover:bg-red-700 transition">
    Admin Page
  </button>
</Link>

      </div>

      {/* SECTION: Your Campaign */}
      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Campaign (4)</h2>

        <div className="bg-white rounded-2xl shadow-lg p-6 flex gap-6 items-center">
          <div className="w-1/3 h-40 bg-gray-200 rounded-xl flex items-center justify-center">
            {/* Ganti dengan video preview jika ada */}
            <span className="text-gray-500">Video/Image</span>
          </div>
          <div className="w-2/3 space-y-2">
            <span className="text-xs uppercase tracking-wide text-gray-500 font-medium">Architecture</span>
            <h3 className="text-xl font-bold text-gray-800">Remake - We Make architecture exhibition</h3>
            <p className="text-sm text-gray-600">
              Remake - We Make: an exhibition about architecture's social agency in the face of urbanisation
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }} />
            </div>
            <div className="text-sm text-gray-600 flex gap-6">
              <span>$2000 <span className="text-gray-400">Raised of $2500</span></span>
              <span>173 <span className="text-gray-400">Total backers</span></span>
              <span>30 <span className="text-gray-400">Days left</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Popular Campaigns */}
      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Popular Campaign</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {campaigns.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all duration-300">
              {c.image_url ? (
                <img
                  src={c.image_url}
                  alt={c.title}
                  className="rounded-xl h-40 w-full object-cover mb-4"
                />
              ) : (
                <div className="h-40 w-full bg-gray-200 flex items-center justify-center rounded-xl mb-4 text-gray-500 text-sm">
                  No Image
                </div>
              )}

              <span className="text-xs uppercase text-gray-400">General</span>
              <h3 className="text-lg font-semibold text-gray-800">{c.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{c.description?.slice(0, 80)}...</p>

              <div className="w-full bg-gray-300 rounded-full h-2 mb-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(c.current_amount / c.target_amount) * 100}%` }}
                />
              </div>

              <p className="text-sm text-gray-700 font-medium">
                ${c.current_amount} <span className="text-gray-400">Raised of ${c.target_amount}</span>
              </p>

              <Link href={`/campaigns/${c.id}`}>
                <button className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-xl w-full hover:bg-purple-700 transition">
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
