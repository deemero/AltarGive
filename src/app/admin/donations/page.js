'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AdminDonations() {
  const [donations, setDonations] = useState([])

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin')
    if (!isAdmin) {
      window.location.href = '/admin-login'
    }

    const fetchDonations = async () => {
      const { data, error } = await supabase
        .from('donations')
        .select(`
          id,
          donor_name,
          amount,
          payment_method,
          proof_url,
          created_at,
          campaign_id,
          campaigns!fk_campaign (
            title,
            current_amount
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error fetching donations:', JSON.stringify(error, null, 2))
      } else {
        setDonations(data)
      }
    }

    fetchDonations()
  }, [])

  const handleApprove = async (donation) => {
    const newAmount = (donation.campaigns?.current_amount || 0) + donation.amount

    // Update campaign's current_amount
    const { error: updateError } = await supabase
      .from('campaigns')
      .update({ current_amount: newAmount })
      .eq('id', donation.campaign_id)

    if (updateError) {
      alert('Error updating campaign progress')
      return
    }

    // Delete donation after approved
    const { error: deleteError } = await supabase
      .from('donations')
      .delete()
      .eq('id', donation.id)

    if (deleteError) {
      alert('Error removing donation after approval')
    } else {
      setDonations((prev) => prev.filter((d) => d.id !== donation.id))
    }
  }

  const handleReject = async (donationId) => {
    const { error } = await supabase
      .from('donations')
      .delete()
      .eq('id', donationId)

    if (error) {
      alert('Error deleting donation')
    } else {
      setDonations((prev) => prev.filter((d) => d.id !== donationId))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    window.location.href = '/'
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">📋 Admin: All Donations</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {donations.length === 0 ? (
        <p className="text-blue-500 font-medium">No donations yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((donation) => (
            <div key={donation.id} className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 space-y-2">
              <h2 className="text-lg font-semibold">{donation.donor_name || 'Anonymous'}</h2>
              <p>💸 <span className="font-medium">RM {donation.amount}</span></p>
              <p>🏷 <span className="text-sm text-gray-500">{donation.payment_method}</span></p>
              <p>🎯 <span className="text-sm text-gray-600">{donation.campaigns?.title || 'Unknown Campaign'}</span></p>
              <p className="text-xs text-gray-500">📅 {new Date(donation.created_at).toLocaleString()}</p>
              {donation.proof_url ? (
                <a
                  href={donation.proof_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline text-sm"
                >
                  View Proof
                </a>
              ) : (
                <p className="text-xs text-gray-400 italic">No proof uploaded</p>
              )}

              <div className="flex gap-3 mt-3">
                {donation.proof_url && (
                  <button
                    onClick={() => handleApprove(donation)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                  >
                    ✅ Approve
                  </button>
                )}
                <button
                  onClick={() => handleReject(donation.id)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm"
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
