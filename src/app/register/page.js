'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    ic_number: '',
    phone: '',
    address: '',
    membership_type: 'bekerja',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // 1. Daftar ke Supabase Auth
    const { data, error: signupError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    })

    if (signupError) {
      setLoading(false)
      alert('❌ Gagal daftar: ' + signupError.message)
      return
    }

    // 2. Simpan ke table members guna user_id dari Supabase Auth
    const { error: insertError } = await supabase.from('members').insert([
      {
        user_id: data.user.id,
        name: formData.name,
        ic_number: formData.ic_number,
        phone: formData.phone,
        address: formData.address,
        membership_type: formData.membership_type,
      },
    ])

    setLoading(false)

    if (insertError) {
      alert('❌ Gagal simpan biodata: ' + insertError.message)
    } else {
      alert('✅ Berjaya daftar! Sila login.')
      router.push('/login')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg border">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Daftar Ahli PMMR</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          name="name"
          placeholder="Nama penuh"
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          name="ic_number"
          placeholder="No Kad Pengenalan"
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          name="phone"
          placeholder="No Telefon"
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          name="address"
          placeholder="Alamat"
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <select
          name="membership_type"
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="bekerja">Bekerja (RM5/bulan)</option>
          <option value="sekolah">Sekolah (RM3/bulan)</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ${
            loading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
        </button>
      </form>
    </div>
  )
}
