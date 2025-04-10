'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('')
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
    setMessage(null)

    const { data, error: signupError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    })

    if (signupError) {
      setLoading(false)
      setMessage('Registration failed: ' + signupError.message)
      setMessageType('error')
      return
    }

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
      setMessage('Saving biodata failed: ' + insertError.message)
      setMessageType('error')
    } else {
      setMessage('Registration successful! Redirecting to login...')
      setMessageType('success')
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left - Register Form */}
        <div className="w-full md:w-1/2 p-10 flex items-center justify-center">
          <div className="w-full max-w-sm">
            {/* Logo Title */}
            <div className="flex items-center justify-center mb-4">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">AltarGive</h1>
            </div>
            <p className="text-sm text-center text-gray-500 mb-6">
              Create your member account below
            </p>

            {/* Notifikasi */}
            {message && (
              <div
                className={`text-sm text-center mb-4 px-4 py-2 rounded ${
                  messageType === 'error'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'bg-green-100 text-green-700 border border-green-200'
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2"
              />
              <input
                type="text"
                name="ic_number"
                placeholder="IC Number"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2"
              />
              <select
                name="membership_type"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2"
              >
                <option value="bekerja">Bekerja (RM5/month)</option>
                <option value="sekolah">Sekolah (RM3/month)</option>
              </select>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-purple-500 to-pink-400 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Registering...' : 'Register Now'}
              </button>

              {/* ✅ Link to login */}
              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{' '}
                <a href="/login" className="text-purple-600 hover:underline font-medium">
                  Log in
                </a>
              </p>
            </form>
          </div>
        </div>

        {/* Right - Gradient Side */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-purple-600 to-pink-500 hidden md:flex items-center justify-center text-center px-8">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-4 tracking-wide drop-shadow-lg">
              <span className="text-white">Altar</span>
              <span className="text-pink-200">Give</span>
            </h1>
            <p className="text-lg text-purple-100 font-medium leading-relaxed">
              Join the PMMR family today. <br />
              Register and become a part of our giving mission 💜
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
