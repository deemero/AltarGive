'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

export default function PaymentPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [monthlyFee, setMonthlyFee] = useState(0)
  const [selectedMonth, setSelectedMonth] = useState('Januari')
  const [loading, setLoading] = useState(true)

  const months = [
    'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
    'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'
  ]

  useEffect(() => {
    const fetchUser = async () => {
      const { data: session, error } = await supabase.auth.getUser()
      if (error || !session?.user) {
        router.push('/login')
        return
      }

      const currentUser = session.user
      setUser(currentUser)

      // Get membership info
      const { data: member } = await supabase
        .from('members')
        .select('*')
        .eq('user_id', currentUser.id)
        .single()

      if (member) {
        setMonthlyFee(member.monthly_fee)
      }

      setLoading(false)
    }

    fetchUser()
  }, [router])

  const handleConfirmPayment = async () => {
    if (!user) {
      alert('User belum login!')
      return
    }

    console.log('user.id:', user.id)

    const { error } = await supabase.from('payments').insert([
      {
        user_id: user.id,
        month: selectedMonth,
        year: new Date().getFullYear(),
        amount: monthlyFee,
        status: 'pending_qr',
        receipt_url: null,
      },
    ])

    if (error) {
      alert('❌ Gagal simpan pembayaran: ' + error.message)
    } else {
      alert('✅ Maklumat bayaran dihantar! Admin akan sahkan.')
      router.push('/member-dashboard')
    }
  }

  if (loading) return <div className="text-center mt-10">Memuatkan...</div>

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow border">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">Bayaran Yuran PMMR</h1>
        <button
          onClick={() => router.push('/member-dashboard')}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Kembali
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block font-medium mb-1">Pilih Bulan</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            {months.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Jumlah</label>
          <input
            type="text"
            value={`RM${monthlyFee}`}
            readOnly
            className="w-full border px-3 py-2 rounded bg-gray-100"
          />
        </div>

        {/* Manual Transfer QR */}
        <div className="bg-gray-100 p-6 rounded text-center flex flex-col items-center space-y-2">
          <p className="font-bold text-lg">PMMR SABAH</p>
          <p>Bank: Touch 'n Go</p>
          <p>Avender Jerricho</p>
          <p>No. Akaun: 100553190219</p>
          <a
            href="https://fxbvoeawcqsdnoxmzzlm.supabase.co/storage/v1/object/public/qr-codes//qr%20codes.png"
            download="qr-code.png"
            className="mt-2 text-purple-700 hover:text-purple-900 underline text-sm"
          >
            ⬇️ Download QR Code
          </a>
          <img
            src="https://fxbvoeawcqsdnoxmzzlm.supabase.co/storage/v1/object/public/qr-codes//qr%20codes.png"
            alt="QR Code"
            className="w-40 h-40 object-contain rounded mx-auto"
          />
        </div>

        {/* Placeholder for Third-Party Gateway */}
        <div className="bg-yellow-50 border border-yellow-300 p-4 rounded">
          <p className="font-semibold mb-2 text-yellow-800">💳 Pilihan Lain:</p>
          <p className="text-sm text-yellow-700">
            Integrasi sistem JomPAY / FPX akan datang. Anda boleh terus bayar secara pindahan bank buat masa ini.
          </p>
        </div>

        <button
          onClick={handleConfirmPayment}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Saya Sudah Bayar
        </button>
      </div>
    </div>
  )
}
