'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function Home() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('start_date', { ascending: false })
        .limit(4);

      if (error) console.error('Error:', error);
      else setCampaigns(data);
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="min-h-screen bg-white p-8 space-y-12 font-sans text-gray-800">
      <section className="flex flex-col md:flex-row items-center justify-between">
        <div className="space-y-6">
          <h2 className="text-5xl font-bold">Altar Give<br /> Grow the community</h2>
          <p className="text-gray-500">
          Embrace the spirit of giving and join our vibrant community of purpose-driven individuals.  
        At AltarGive, we connect generous hearts with impactful missions, empowering you to make a meaningful difference..
          </p>
          <div className="space-x-4">
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">Explore Campaign</button>
            <button className="border border-purple-600 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50">About us</button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Our Campaigns Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {campaigns.map((c) => (
            <div key={c.id} className="bg-gray-50 rounded-xl shadow-lg p-5 hover:shadow-xl transition-all duration-300">
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

              <h3 className="text-lg font-semibold text-gray-800">{c.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{c.description?.slice(0, 80)}...</p>

              <div className="w-full bg-gray-300 rounded-full h-2 mb-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${(c.current_amount / c.target_amount) * 100}%` }}
                />
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-700">
                  RM {c.current_amount} Raised
                </p>
                <p className="text-sm text-gray-400">
                  RM {c.target_amount} Goal
                </p>
              </div>

              <Link href={`/campaigns/${c.id}`}>
                <button className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-xl w-full hover:bg-purple-700">
                  View Details
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}