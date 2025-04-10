'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('') // 'success' or 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    setLoading(false)

    if (error) {
      setMessage('Login failed: Invalid email or password')
      setMessageType('error')
    } else {
      setMessage('Login successful! Redirecting....')
      setMessageType('success')
      setTimeout(() => {
        router.push('/member-dashboard')
      }, 1500)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left - Login Form */}
        <div className="w-full md:w-1/2 p-10 flex items-center justify-center">
          <div className="w-full max-w-sm">
            {/* Title */}
            <div className="flex items-center justify-center mb-4">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">AltarGive</h1>
            </div>
            <p className="text-sm text-center text-gray-500 mb-6">
              Welcome back! Please enter your details
            </p>

            {/* Notifikasi UI */}
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* <div className="text-right">
                <Link href="/forgot-password" className="text-sm text-purple-600 hover:underline">
                  Forgot password?
                </Link>
              </div> */}

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-purple-500 to-pink-400 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Don’t have an account?{' '}
              <Link href="/register" className="text-purple-600 hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Right - Gradient Side with Logo & Text */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-purple-600 to-pink-500 hidden md:flex items-center justify-center text-center px-8">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-4 tracking-wide drop-shadow-lg">
              <span className="text-white">Altar</span>
              <span className="text-pink-200">Give</span>
            </h1>
            <p className="text-lg text-purple-100 font-medium leading-relaxed">
              Membina semangat pemberian dengan penuh kasih. <br />
              Sila log masuk untuk meneruskan misi kebaikan anda
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
