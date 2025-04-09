'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

export default function MemberDashboard() {
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [monthlyFee, setMonthlyFee] = useState(0)
  const [selectedMonth, setSelectedMonth] = useState('Januari')
  const [file, setFile] = useState(null)
  const [user, setUser] = useState(null)
  const [paymentProgress, setPaymentProgress] = useState([])
  const [dermaAmount, setDermaAmount] = useState(0)
  const [dermaFile, setDermaFile] = useState(null)

  const months = [
    'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
    'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  useEffect(() => {
    const fetchMemberData = async () => {
      const { data: session } = await supabase.auth.getUser()
      if (!session?.user) {
        router.push('/login')
        return
      }

      setUser(session.user)

      const { data: member } = await supabase
        .from('members')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (member) {
        setUserData(member)
        setMonthlyFee(member.monthly_fee)
      }

      const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('year', new Date().getFullYear())

      setPaymentProgress(payments || [])
      setLoading(false)
    }

    fetchMemberData()
  }, [router])

  const handleUpload = async () => {
    if (!file) return alert('Sila pilih fail!')

    const { data: existing } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user.id)
      .eq('month', selectedMonth)
      .eq('year', new Date().getFullYear())
      .eq('payment_type', 'yuran')

    if (existing.length > 0) {
      return alert('❌ Bayaran untuk bulan ini sudah dibuat.')
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('receipts')
      .upload(filePath, file)

    if (uploadError) return alert('❌ Gagal upload: ' + uploadError.message)

    const { error: insertError } = await supabase.from('payments').insert([{
      user_id: user.id,
      month: selectedMonth,
      year: new Date().getFullYear(),
      amount: monthlyFee,
      receipt_url: uploadData?.path || null,
      status: 'pending',
      payment_type: 'yuran',
    }])

    if (insertError) {
      alert('❌ Gagal simpan pembayaran: ' + insertError.message)
    } else {
      alert('✅ Resit berjaya dihantar! Tunggu pengesahan admin.')
      setFile(null)
    }
  }

  const handleDonate = async () => {
    if (!user || dermaAmount <= 0) return alert('Sila masukkan jumlah derma sah.')
    if (!dermaFile) return alert('Sila upload bukti pembayaran derma.')

    const ext = dermaFile.name.split('.').pop()
    const fileName = `${uuidv4()}.${ext}`
    const { data: uploaded, error: uploadError } = await supabase.storage
      .from('receipts')
      .upload(fileName, dermaFile)

    if (uploadError) return alert('❌ Gagal upload resit: ' + uploadError.message)

    const { error } = await supabase.from('payments').insert([{
      user_id: user.id,
      year: new Date().getFullYear(),
      amount: dermaAmount,
      status: 'pending',
      payment_type: 'derma',
      receipt_url: uploaded.path
    }])

    if (error) {
      alert('❌ Gagal hantar derma: ' + error.message)
    } else {
      alert('✅ Derma dihantar! Tunggu pengesahan admin.')
      setDermaAmount(0)
      setDermaFile(null)
    }
  }

  if (loading) return <div className="text-center mt-10">Memuatkan data...</div>
  if (!userData) return <div className="text-center mt-10 text-red-500">Maklumat tidak dijumpai</div>

  const { name, ic_number, phone, address, membership_type } = userData
  const totalAmount = monthlyFee * 12

  const getStatus = (month) => {
    const match = paymentProgress.find(p => p.month === month && p.payment_type === 'yuran')
    return match?.status || 'belum_bayar'
  }

  const totalYuran = paymentProgress.reduce((sum, p) => {
    return p.status === 'approved' && p.payment_type === 'yuran' ? sum + Number(p.amount) : sum
  }, 0)

  const totalDerma = paymentProgress.reduce((sum, p) => {
    return p.status === 'approved' && p.payment_type === 'derma' ? sum + Number(p.amount) : sum
  }, 0)

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow border">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Ahli</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >Logout</button>
      </div>

      <div className="space-y-3">
        <p><strong>Nama:</strong> {name}</p>
        <p><strong>No IC:</strong> {ic_number}</p>
        <p><strong>No Telefon:</strong> {phone}</p>
        <p><strong>Alamat:</strong> {address}</p>
        <p><strong>Jenis Keahlian:</strong> {membership_type}</p>
        <p><strong>Yuran Bulanan:</strong> RM{monthlyFee}</p>
        <p><strong>Jumlah Setahun:</strong> RM{totalAmount}</p>

        <div className="mt-4">
          <p className="text-sm font-semibold">Progress Yuran: RM{totalYuran} / RM{totalAmount}</p>
          <div className="w-full h-3 bg-gray-200 rounded">
            <div
              className="h-3 bg-green-500 rounded"
              style={{ width: `${(totalYuran / totalAmount) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-semibold">Jumlah Derma: RM{totalDerma}</p>
          <div className="w-full h-3 bg-gray-200 rounded">
            <div
              className="h-3 bg-purple-600 rounded"
              style={{ width: `${Math.min((totalDerma / 100) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => router.push('/pay')}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Bayar Guna QR / FPX
        </button>
      </div>

      <div className="mt-8 border-t pt-4">
        <h2 className="text-lg font-semibold mb-3">Bayaran Yuran Secara Manual</h2>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {months.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border px-2 py-2 rounded"
          />
          <button
            onClick={handleUpload}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >Hantar Resit</button>
        </div>
        <p className="text-sm text-gray-500">Atau muat naik bukti pembayaran secara manual jika guna pindahan bank biasa.</p>
      </div>

      <div className="mt-10 border-t pt-4">
        <h2 className="text-lg font-semibold mb-3">Derma Sokongan PMMR</h2>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <input
            type="number"
            placeholder="Jumlah Derma (contoh: 10)"
            value={dermaAmount}
            onChange={(e) => setDermaAmount(e.target.value)}
            className="border px-3 py-2 rounded w-40"
          />
          <input
            type="file"
            onChange={(e) => setDermaFile(e.target.files[0])}
            className="border px-2 py-2 rounded"
          />
          <button
            onClick={handleDonate}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >Hantar Derma</button>
        </div>
        <p className="text-sm text-gray-500">Derma ini adalah tambahan dan wajib disertakan bukti pembayaran.</p>
      </div>

      <div className="mt-10 border-t pt-4">
        <h2 className="text-lg font-semibold mb-3">Status Bayaran Anda</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {months.map((m) => (
            <div key={m} className="border rounded p-2 text-center">
              <p className="font-semibold">{m}</p>
              <p className={`text-sm ${getStatus(m) === 'approved' ? 'text-green-600' : getStatus(m) === 'pending' || getStatus(m) === 'pending_qr' ? 'text-yellow-600' : getStatus(m) === 'rejected' ? 'text-red-600' : 'text-gray-500'}`}>
                {getStatus(m).replace('_', ' ')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
