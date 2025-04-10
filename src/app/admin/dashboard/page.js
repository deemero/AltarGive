'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AdminDashboard() {
  const [totalDonations, setTotalDonations] = useState(0)
  const [activeCampaigns, setActiveCampaigns] = useState(0)
  const [activeUsers, setActiveUsers] = useState(0)
  const [members, setMembers] = useState([])

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin')
    if (!isAdmin) window.location.href = '/admin-login'

    const fetchData = async () => {
      const { data: dermaData } = await supabase
        .from('payments')
        .select('amount')
        .eq('payment_type', 'derma')
        .eq('status', 'approved')

      const { data: campaignData } = await supabase
        .from('campaigns')
        .select('current_amount')

      const dermaTotal = dermaData?.reduce((sum, d) => sum + Number(d.amount), 0) || 0
      const campaignTotal = campaignData?.reduce((sum, c) => sum + Number(c.current_amount), 0) || 0
      setTotalDonations(dermaTotal + campaignTotal)

      const today = new Date().toISOString().split('T')[0]
      const { data: activeData } = await supabase
        .from('campaigns')
        .select('id')
        .gte('end_date', today)
      setActiveCampaigns(activeData?.length || 0)

      const { data: memberList } = await supabase
        .from('members')
        .select('id, name, membership_type, user_id, monthly_fee, phone')

      const { data: payments } = await supabase
        .from('payments')
        .select('user_id, amount, status')

      const finalList = memberList.map((m) => {
        const userPayments = payments.filter((p) => p.user_id === m.user_id)
        const totalPaid = userPayments
          .filter((p) => p.status === 'approved')
          .reduce((sum, p) => sum + Number(p.amount), 0)

        return {
          name: m.name,
          phone: m.phone || '-',
          type: m.membership_type,
          amount: totalPaid,
          status: totalPaid > 0 ? 'active' : 'pending',
        }
      })

      setMembers(finalList)
      const activeCount = finalList.filter((m) => m.status === 'active').length
      setActiveUsers(activeCount)
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-10 p-6">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

      {/* Gradient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl p-6 shadow text-white bg-gradient-to-br from-purple-600 to-purple-400">
          <h3 className="text-sm font-semibold">Total Donations</h3>
          <p className="text-2xl font-bold">RM {totalDonations.toLocaleString()}</p>
          <p className="text-xs text-white/80 mt-1">Increased by 60%</p>
        </div>
        <div className="rounded-xl p-6 shadow text-white bg-gradient-to-br from-blue-600 to-blue-400">
          <h3 className="text-sm font-semibold">Active Campaigns</h3>
          <p className="text-2xl font-bold">{activeCampaigns}</p>
          <p className="text-xs text-white/80 mt-1">Real-time data</p>
        </div>
        <div className="rounded-xl p-6 shadow text-white bg-gradient-to-br from-pink-500 to-orange-400">
          <h3 className="text-sm font-semibold">Active Users</h3>
          <p className="text-2xl font-bold">{activeUsers}</p>
          <p className="text-xs text-white/80 mt-1">Updated daily</p>
        </div>
      </div>

      {/* Members Table / Cards */}
      <div className="bg-white shadow rounded-xl p-6 mt-4">
        <h2 className="text-xl font-bold text-gray-700 mb-4">User Stats</h2>

        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="w-full text-sm text-left bg-white rounded-xl">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">User Type</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 py-4">Tiada data dijumpai</td>
                </tr>
              ) : (
                members.map((m, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{m.name}</td>
                    <td className="py-2 px-4">{m.phone}</td>
                    <td className="py-2 px-4 capitalize">{m.type}</td>
                    <td className="py-2 px-4">RM{m.amount}</td>
                    <td className="py-2 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs text-white ${
                        m.status === 'active' ? 'bg-green-600' : 'bg-purple-500'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked card style */}
        <div className="space-y-4 md:hidden">
          {members.length === 0 ? (
            <p className="text-gray-500 text-sm">Tiada data dijumpai</p>
          ) : (
            members.map((m, i) => (
              <div key={i} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                <p><strong>Name:</strong> {m.name}</p>
                <p><strong>Phone:</strong> {m.phone}</p>
                <p><strong>User Type:</strong> {m.type}</p>
                <p><strong>Amount:</strong> RM{m.amount}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`px-2 py-1 text-xs rounded-full text-white ${
                    m.status === 'active' ? 'bg-green-600' : 'bg-purple-500'
                  }`}>
                    {m.status}
                  </span>
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
