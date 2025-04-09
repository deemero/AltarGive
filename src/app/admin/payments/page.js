'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPayments = async () => {
    const { data, error } = await supabase
      .from('payments')
      .select('*, members(name, ic_number)')
      .order('created_at', { ascending: false })

    if (!error) {
      setPayments(data)
    }
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
    <div className="max-w-6xl mx-auto p-6 mt-10 bg-white shadow rounded-xl">
      <h1 className="text-2xl font-bold mb-6">Senarai Bayaran Ahli (Admin)</h1>

      {loading ? (
        <p>Memuatkan bayaran...</p>
      ) : payments.length === 0 ? (
        <p className="text-gray-500">Tiada bayaran dijumpai.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2 border">Nama</th>
                <th className="p-2 border">IC</th>
                <th className="p-2 border">Bulan</th>
                <th className="p-2 border">Jumlah</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Resit</th>
                <th className="p-2 border">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((pay) => (
                <tr key={pay.id}>
                  <td className="p-2 border">{pay.members?.name || '-'}</td>
                  <td className="p-2 border">{pay.members?.ic_number || '-'}</td>
                  <td className="p-2 border">{pay.month} {pay.year}</td>
                  <td className="p-2 border">RM{pay.amount}</td>
                  <td className="p-2 border">
                    <span className={`px-2 py-1 rounded text-white text-xs ${
                      pay.status === 'approved' ? 'bg-green-600'
                      : pay.status === 'rejected' ? 'bg-red-500'
                      : 'bg-yellow-500'
                    }`}>
                      {pay.status}
                    </span>
                  </td>
                  <td className="p-2 border">
                    {pay.receipt_url ? (
                      <a
                        href={`https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/receipts/${pay.receipt_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Lihat Resit
                      </a>
                    ) : (
                      <span className="text-gray-400">Tiada</span>
                    )}
                  </td>
                  <td className="p-2 border space-x-1">
                    <button
                      onClick={() => updateStatus(pay.id, 'approved')}
                      className="bg-green-600 text-white px-2 py-1 text-xs rounded"
                    >Approve</button>
                    <button
                      onClick={() => updateStatus(pay.id, 'rejected')}
                      className="bg-red-500 text-white px-2 py-1 text-xs rounded"
                    >Reject</button>
                    <button
                      onClick={() => handleResetUser(pay.user_id, pay.members?.name)}
                      className="bg-orange-500 text-white px-2 py-1 text-xs rounded"
                    >Reset</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}