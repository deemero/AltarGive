'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPayments = async () => {
    const { data: paymentData, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching payments:', error.message)
      setLoading(false)
      return
    }

    const { data: membersData } = await supabase
      .from('members')
      .select('user_id, name, ic_number')

    const combined = paymentData.map((p) => {
      const member = membersData?.find((m) => m.user_id === p.user_id)
      return { ...p, member }
    })

    setPayments(combined)
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from('payments')
      .update({ status })
      .eq('id', id)

    if (!error) {
      alert(`Status telah ditukar ke "${status}".`)
      fetchPayments()
    } else {
      alert('❌ Gagal kemaskini status.')
    }
  }

  const handleResetUser = async (userId, userName) => {
    const confirmReset = window.confirm(`Reset semua bayaran untuk ${userName}?`)
    if (!confirmReset) return

    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('user_id', userId)

    if (error) {
      alert('❌ Gagal reset bayaran: ' + error.message)
    } else {
      alert(`✅ Semua bayaran ${userName} telah dipadam.`)
      fetchPayments()
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Senarai Bayaran Ahli (Admin)</h1>

      {loading ? (
        <p className="text-gray-600">Memuatkan bayaran...</p>
      ) : payments.length === 0 ? (
        <p className="text-gray-500">Tiada bayaran dijumpai.</p>
      ) : (
        <div className="bg-white shadow rounded-xl overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-sm divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Nama</th>
                  <th className="px-4 py-3 text-left">IC</th>
                  <th className="px-4 py-3 text-left">Bulan</th>
                  <th className="px-4 py-3 text-left">Jumlah</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Resit</th>
                  <th className="px-4 py-3 text-left">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((pay) => (
                  <tr key={pay.id}>
                    <td className="px-4 py-2">{pay.member?.name || '-'}</td>
                    <td className="px-4 py-2">{pay.member?.ic_number || '-'}</td>
                    <td className="px-4 py-2">{pay.month} {pay.year}</td>
                    <td className="px-4 py-2">RM{pay.amount}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-white text-xs ${
                        pay.status === 'approved' ? 'bg-green-600' :
                        pay.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}>
                        {pay.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {pay.receipt_url ? (
                        <a
                        href={`https://fxbvoeawcqsdnoxmzzlm.supabase.co/storage/v1/object/public/receipts/${pay.receipt_url}`}

                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >Lihat Resit</a>
                      ) : <span className="text-gray-400">Tiada</span>}
                    </td>
                    <td className="px-4 py-2 space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => updateStatus(pay.id, 'approved')}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                      >Approve</button>
                      <button
                        onClick={() => updateStatus(pay.id, 'rejected')}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                      >Reject</button>
                      <button
                        onClick={() => handleResetUser(pay.user_id, pay.member?.name)}
                        className="bg-orange-500 text-white px-3 py-1 rounded text-xs hover:bg-orange-600"
                      >Reset</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden divide-y divide-gray-100">
            {payments.map((pay) => (
              <div key={pay.id} className="p-4 space-y-1">
                <div className="text-gray-800 font-medium">{pay.member?.name || '-'}</div>
                <div className="text-sm text-gray-500">IC: {pay.member?.ic_number || '-'}</div>
                <div className="text-sm">🗓 {pay.month} {pay.year}</div>
                <div className="text-sm">💰 RM{pay.amount}</div>
                <div className="text-sm">
                  Status: <span className={`px-2 py-0.5 rounded text-white text-xs ${
                    pay.status === 'approved' ? 'bg-green-600' :
                    pay.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}>{pay.status}</span>
                </div>
                <div className="text-sm">
                  Resit:{' '}
                  {pay.receipt_url ? (
                    <a
                    href={`https://fxbvoeawcqsdnoxmzzlm.supabase.co/storage/v1/object/public/receipts/${pay.receipt_url}`}

                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >Lihat Resit</a>
                  ) : <span className="text-gray-400 italic">Tiada</span>}
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => updateStatus(pay.id, 'approved')}
                    className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                  >Approve</button>
                  <button
                    onClick={() => updateStatus(pay.id, 'rejected')}
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                  >Reject</button>
                  <button
                    onClick={() => handleResetUser(pay.user_id, pay.member?.name)}
                    className="bg-orange-500 text-white px-3 py-1 rounded text-xs hover:bg-orange-600"
                  >Reset</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}