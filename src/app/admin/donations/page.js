'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function AdminDonations() {
  const [donations, setDonations] = useState([])

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin')
    if (!isAdmin) window.location.href = '/admin-login'

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

      if (!error) setDonations(data)
    }

    fetchDonations()
  }, [])

  const handleApprove = async (donation) => {
    const newAmount = (donation.campaigns?.current_amount || 0) + donation.amount

    const { error: updateError } = await supabase
      .from('campaigns')
      .update({ current_amount: newAmount })
      .eq('id', donation.campaign_id)

    if (updateError) {
      alert('Error updating campaign progress')
      return
    }

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

    if (!error) {
      setDonations((prev) => prev.filter((d) => d.id !== donationId))
    } else {
      alert('Error rejecting donation')
    }
  }

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-700">All Donations</h1>
      </div>

      {/* Desktop Table */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Payment</th>
                <th className="px-4 py-3 text-left">Campaign</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Proof</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {donations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">No donations yet.</td>
                </tr>
              ) : (
                donations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{donation.donor_name || 'Anonymous'}</td>
                    <td className="px-4 py-3">RM {donation.amount}</td>
                    <td className="px-4 py-3">{donation.payment_method}</td>
                    <td className="px-4 py-3">{donation.campaigns?.title || '-'}</td>
                    <td className="px-4 py-3">{new Date(donation.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      {donation.proof_url ? (
                        <a
                          href={donation.proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        <span className="italic text-gray-400">No proof</span>
                      )}
                    </td>
                    <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                      {donation.proof_url && (
                        <button
                          onClick={() => handleApprove(donation)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleReject(donation.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="md:hidden divide-y divide-gray-100">
          {donations.length === 0 ? (
            <div className="text-center text-gray-500 py-6">No donations yet.</div>
          ) : (
            donations.map((donation) => (
              <div key={donation.id} className="p-4 space-y-1 hover:bg-gray-50 transition">
                <div className="text-gray-900 font-semibold">{donation.donor_name || 'Anonymous'}</div>
                <div className="text-gray-600 text-sm">💸 RM {donation.amount}</div>
                <div className="text-gray-600 text-sm">🏷 {donation.payment_method}</div>
                <div className="text-gray-600 text-sm">🎯 {donation.campaigns?.title || '-'}</div>
                <div className="text-gray-600 text-sm">📅 {new Date(donation.created_at).toLocaleString()}</div>
                <div className="text-sm">
                  {donation.proof_url ? (
                    <a
                      href={donation.proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 underline"
                    >
                      View Proof
                    </a>
                  ) : (
                    <span className="italic text-gray-400">No proof uploaded</span>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  {donation.proof_url && (
                    <button
                      onClick={() => handleApprove(donation)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleReject(donation.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
